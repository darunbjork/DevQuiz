import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>);
    const button = screen.getByText('Test');
    expect(button).toHaveClass('btn-primary');
  });

  it('applies danger variant when specified', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('btn-danger');
  });
});