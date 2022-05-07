import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import Selection from './Selection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


test('Selection', () => {
    const wrapper = render(
      <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Selection/>}/>
            </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(wrapper.getByText('Select folder and images layout')).toBeInTheDocument();
  });
