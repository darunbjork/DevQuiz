import { render, screen } from '@testing-library/react';
import Card from '../../components/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Child element</div>
      </Card>
    );
    expect(screen.getByText('Child element')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="extra-class">Content</Card>);
    expect(container.firstChild).toHaveClass('card extra-class');
  });
});
