import { render, screen, act } from "@testing-library/react";
// Importing the jest testing library
import '@testing-library/jest-dom'
import ReadResponse from "../services/responses/ReadResponse";
import App from "../App";
import TodoItem from "../models/TodoItem";
import TodoItemStatus from "../models/TodoItemStatus";


jest.mock('../services/stomp/Client', () => ({
  getStompClient: jest.fn(),
  initStompClient: jest.fn()
}));

test("App Rendering", async () => {
  mockResponse(new ReadResponse({ items: [] }));
  act(() => {
    render(<App />);
  })

  // Initially, the App should render the MenuBar
  const menubar = await screen.findByTestId("menu-bar");
  expect(menubar).toBeInTheDocument();

  // The App should render the TodoItemList with no items
  const noItemMsg = screen.getByTestId("no-item-msg");
  expect(noItemMsg).toBeInTheDocument();

  // The App should render the Footer
  const footer = screen.getByTestId("footer-msg");
  expect(footer).toBeInTheDocument();


  const refreshBtn = screen.getByTestId("refresh-btn");
  expect(footer).toBeInTheDocument();

  mockResponse(new ReadResponse({ items: [new TodoItem({ id: '123456', name: 'taskname', status: TodoItemStatus.NotStarted })] }));
  act(() => {
    refreshBtn.click();
  });

  const itemlistPaper = await screen.findByTestId("has-item-paper");
  expect(itemlistPaper).toBeInTheDocument();

})

const mockResponse = (response: any) => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response)
    })
  );
}