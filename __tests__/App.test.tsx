import { render, screen } from '@testing-library/react-native';

import App from '../App';

it('renders without crashing', () => {
  render(<App />);
  expect(screen.getByText('hlyst')).toBeTruthy();
});
