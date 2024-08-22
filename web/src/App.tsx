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
// import { useSubscription } from 'react-stomp-hooks';
import { randomString } from './utils/Random';
import { getStompClient, initStompClient } from './services/stomp/Client';
import CreateTodoItemActivity from './services/activities/CreateTodoItemActivity';
import UpdateTodoItemActivity from './services/activities/UpdateTodoItemActivity';
import DeleteTodoItemActivity from './services/activities/DeleteTodoItemActivity';
import ExceptionResponse from './services/responses/ExceptionResponse';

// This is a random string to identify the client. It is used to filter out the client's own activities.
export const AppClientName = randomString(10);

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
      if (mode !== AppMode.LIST || clientName === AppClientName) return;
      enqueueSnackbar(message);
    }
    activityReceiver.current = {
      onReceiveCreateActivity: (activity: CreateTodoItemActivity) => {
        showMessage(activity.clientName, "Someone creates a new TODO item named '" + activity.todoItemName + "'");
      },
      onReceiveUpdateActivity: (activity: UpdateTodoItemActivity) => {
        showMessage(activity.clientName, "Someone updates the TODO item named '" + activity.todoItemName + "'");
      },
      onReceiveDeleteActivity: (activity: DeleteTodoItemActivity) => {
        showMessage(activity.clientName, "Someone deletes a TODO item named '" + activity.todoItemName + "'");
      }
    };
  }, [mode, enqueueSnackbar])

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

  // Refresh the todo items when the mode is in INIT or LIST
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
