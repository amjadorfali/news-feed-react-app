import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider, } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Root from './modules/Root';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />
  },
]);

const theme = responsiveFontSizes(
  createTheme({
    palette: { primary: { main: '#0187CB' } }
  },

  )
);

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
      <ReactQueryDevtools initialIsOpen={false} position="left" />
    </QueryClientProvider>
  )
}

export default App
