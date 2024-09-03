import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

import { Backdrop, CircularProgress, Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ActivityReceiver, API, Feeds } from './services/Api';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';
import TodoItem from './models/TodoItem';
import TodoItemList from './components/TodoItemList';
import { FilterArgs, SortByArgs } from './types/Types';
import ReadRequest from './services/requests/ReadRequest';
import FilterParams from './services/params/FilterParams';
import EditTodoItemMenuBar from './components/EditTodoItemMenuBar';
import EditTodoItemForm from './components/EditTodoItemForm';
import { useSnackbar } from 'notistack';
import { getStompClient, initStompClient } from './services/stomp/Client';
import CreateTodoItemActivity from './services/activities/CreateTodoItemActivity';
import UpdateTodoItemActivity from './services/activities/UpdateTodoItemActivity';
import DeleteTodoItemActivity from './services/activities/DeleteTodoItemActivity';
import ExceptionResponse from './services/responses/ExceptionResponse';
import { shorterString } from './utils/StringUtil';
import { useAccount } from './context/AccountContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

enum AppMode {
  INIT = 'init',
  LIST = 'list',
  EDIT = 'edit',
}

function App() {

  const [mode, setMode] = useState(AppMode.INIT);
  const [isLoading, setIsLoading] = useState(false);

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null);

  const [refreshRequest, setRefreshRequest] = useState<ReadRequest>({});

  const { enqueueSnackbar } = useSnackbar();

  const { username, loadFromCookie } = useAccount();

  useEffect(() => {
    loadFromCookie();
  }, [loadFromCookie]);

  // Setup the Stomp Client to subscribe to the feeds
  const activityReceiver = useRef<ActivityReceiver>(ActivityReceiver.empty);
  useEffect(() => {
    initStompClient(() => {
      const stompClient = getStompClient();

      stompClient?.subscribe(Feeds.Create.subPath, (message) => {
        const activity = Feeds.Create.parseActivityMessageBody(message.body);
        activityReceiver.current.onReceiveCreateActivity(activity);
      })

      stompClient?.subscribe(Feeds.Update.subPath, (message) => {
        const activity = Feeds.Update.parseActivityMessageBody(message.body);
        activityReceiver.current.onReceiveUpdateActivity(activity);
      });

      stompClient?.subscribe(Feeds.Delete.subPath, (message) => {
        const activity = Feeds.Delete.parseActivityMessageBody(message.body);
        activityReceiver.current.onReceiveDeleteActivity(activity);
      });
    })
  }, [])

  // Setup handlers to show the activity messages
  useEffect(() => {
    const showMessage = (clientName: string, message: string) => {
      // show only if current page is in list mode and the activity is not from the client itself
      if (mode !== AppMode.LIST || clientName === username) return;
      enqueueSnackbar(message);
    }
    activityReceiver.current = {
      onReceiveCreateActivity: (activity: CreateTodoItemActivity) => {
        const userName = shorterString(activity.clientName, 10);
        const todoItemName = shorterString(activity.todoItemName, 10);
        showMessage(activity.clientName, "User '" + userName + "' creates a new TODO item named '" + todoItemName + "'");
      },
      onReceiveUpdateActivity: (activity: UpdateTodoItemActivity) => {
        const userName = shorterString(activity.clientName, 10);
        const todoItemName = shorterString(activity.todoItemName, 10);
        showMessage(activity.clientName, "User '" + userName + "' updates the TODO item named '" + todoItemName + "' status=" + activity.todoItemStatus);
      },
      onReceiveDeleteActivity: (activity: DeleteTodoItemActivity) => {
        const userName = shorterString(activity.clientName, 10);
        const todoItemName = shorterString(activity.todoItemName, 10);
        showMessage(activity.clientName, "User '" + userName + "' deletes a TODO item named '" + todoItemName + "'");
      }
    };
  }, [mode, username, enqueueSnackbar])

  // Refresh the todo items and set the mode to LIST
  const refreshTodoItems = useCallback(() => {
    setIsLoading(true);
    API.read(refreshRequest).then((response) => {
      setTodoItems(response.items)

      setMode(AppMode.LIST);
    })
      .catch((exceptionResponse: ExceptionResponse) => {
        enqueueSnackbar("Fail to read. Error: " + exceptionResponse.error, { variant: 'error' });
      })
      .finally(() => setIsLoading(false));
  }, [refreshRequest, enqueueSnackbar]);

  // Refresh the todo items when the mode is INIT or LIST
  useEffect(() => {
    if (mode !== AppMode.INIT && mode !== AppMode.LIST) return;
    refreshTodoItems();
  }, [mode, refreshTodoItems]);

  const selectSortBy = (args: SortByArgs | null) => {
    setRefreshRequest({ ...refreshRequest, sort: args ? args : undefined });
  }

  const selectShowPage = (page: number, limit: number, filterArgs: FilterArgs | null) => {
    setRefreshRequest({ ...refreshRequest, pagination: { page, limit }, filter: filterArgs ? new FilterParams(filterArgs) : undefined });
  }

  const selectTodoItem = (item: TodoItem) => {
    setEditingItem(item);
    setMode(AppMode.EDIT);
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {mode === AppMode.LIST && (
          <Container sx={{ flex: 1 }}>
            <MenuBar
              onCreated={() => { refreshTodoItems() }}
              onSelectSortBy={selectSortBy}
              onSelectShowPage={selectShowPage}
              onClickRefresh={() => { refreshTodoItems() }}
            />

            <TodoItemList todoItems={todoItems} selectTodoItem={selectTodoItem} />
          </Container>
        )}

        {mode === AppMode.EDIT && (
          <Container sx={{ flex: 1 }} >
            <EditTodoItemMenuBar
              editingItem={editingItem!}
              onClickBack={() => setMode(AppMode.LIST)} />

            <EditTodoItemForm editingItem={editingItem!} />
          </Container>
        )}

        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
