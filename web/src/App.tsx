import { useEffect, useState } from 'react';
import './App.css';

import { Backdrop, CircularProgress, Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { API, Feeds } from './services/Api';
import MenuBar from './conpoments/MenuBar';
import Footer from './conpoments/Footer';
import TodoItem from './models/TodoItem';
import TodoItemList from './conpoments/TodoItemList';
import { FilterArgs, SortByArgs } from './types/Types';
import ReadRequest from './services/requests/ReadRequest';
import FilterParams from './services/params/FilterParams';
import EditTodoItemMenuBar from './conpoments/EditTodoItemMenuBar';
import EditTodoItemForm from './conpoments/EditTodoItemForm';
import { useSnackbar } from 'notistack';
// import { useSubscription } from 'react-stomp-hooks';
import { randomString } from './utils/Random';
import { getStompClient, initStompClient } from './services/stomp/Client';

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
  const [isStompClientConnected, setIsStompClientConnected] = useState(false);


  useEffect(() => {
    initStompClient(() => { setIsStompClientConnected(true) })
  }, [])

  useEffect(() => {
    if (mode !== AppMode.INIT && mode !== AppMode.LIST) return;
    refreshTodoItems(refreshRequest);
  }, [refreshRequest, mode]);

  useEffect(() => {
    if (!isStompClientConnected) return;
    const stompClient = getStompClient();

    stompClient?.subscribe(Feeds.Create.subPath, (message) => {
      if (mode !== AppMode.LIST) return;
      const activity = Feeds.Create.parseActivityMessageBody(message.body);
      if (activity.clientName === AppClientName) return;
      enqueueSnackbar("Someone creates a new TODO item named '" + activity.todoItemName + "'");
    })

    stompClient?.subscribe(Feeds.Update.subPath, (message) => {
      if (mode !== AppMode.LIST) return;
      const activity = Feeds.Update.parseActivityMessageBody(message.body);
      if (activity.clientName === AppClientName) return;
      enqueueSnackbar("Someone updates the TODO item named '" + activity.todoItemName + "'");
    });

    stompClient?.subscribe(Feeds.Delete.subPath, (message) => {
      if (mode !== AppMode.LIST) return;
      const activity = Feeds.Delete.parseActivityMessageBody(message.body);
      if (activity.clientName === AppClientName) return;
      enqueueSnackbar("Someone deletes a item named '" + activity.todoItemName + "'");
    });

  }, [isStompClientConnected, mode, enqueueSnackbar])




  const refreshTodoItems = (request: ReadRequest) => {
    setIsLoading(true);
    API.read(request).then((response) => {
      setTodoItems(response.items)
      setIsLoading(false);

      setMode(AppMode.LIST);
    });
  }

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
              onCreated={() => { refreshTodoItems(refreshRequest) }}
              onSelectSortBy={selectSortBy}
              onSelectShowPage={selectShowPage}
              onClickRefresh={() => { refreshTodoItems(refreshRequest) }}
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
