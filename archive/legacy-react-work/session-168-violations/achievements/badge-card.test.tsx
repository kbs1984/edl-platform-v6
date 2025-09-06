/**
 * BadgeCard Component Tests
 * Session 168 - Achievement System
 * 
 * Tests based on Phase 4 research:
 * - Accessibility patterns from React ARIA documentation
 * - Performance patterns from Framer Motion guide  
 * - React best practices for 2025
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BadgeCard, type BadgeData } from '../badge-card';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

const mockBadge: BadgeData = {
  id: 'test-badge-1',
  name: 'Test Achievement',
  description: 'A test achievement badge',
  type: 'public',
  category: 'participation',
  rarity: 'common',
  emcoin_reward: 10,
  earned: false,
  current_progress: 3,
  requirement_value: 5
};

const earnedBadge: BadgeData = {
  ...mockBadge,
  id: 'earned-badge-1',
  earned: true,
  earned_at: '2025-09-05T00:00:00.000Z'
};

describe('BadgeCard Component', () => {
  describe('Rendering States', () => {
    it('renders loading state correctly', () => {
      render(<BadgeCard loading={true} />);
      
      // Should show skeleton loader
      expect(screen.getByRole('generic')).toBeInTheDocument();
      // Should contain skeleton elements for image and text
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders error state with proper accessibility', () => {
      const testError = new Error('Failed to load badge data');
      render(<BadgeCard error={testError} />);
      
      // Should show error message
      expect(screen.getByText('Failed to load badge')).toBeInTheDocument();
      expect(screen.getByText(testError.message)).toBeInTheDocument();
      
      // Should have proper ARIA attributes for error state
      const errorContainer = screen.getByRole('alert', { level: 'assertive' });
      expect(errorContainer).toHaveClass('border-red-300');
    });

    it('renders empty state when no badge provided', () => {
      render(<BadgeCard />);
      
      expect(screen.getByText('Badge not available')).toBeInTheDocument();
      expect(screen.getByLabelText('Badge locked')).toBeInTheDocument();
    });

    it('renders badge data correctly when provided', () => {
      render(<BadgeCard badge={mockBadge} />);
      
      expect(screen.getByText(mockBadge.name)).toBeInTheDocument();
      expect(screen.getByText(mockBadge.type)).toBeInTheDocument();
      expect(screen.getByText(`🪙 ${mockBadge.emcoin_reward}`)).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('Badge States', () => {
    it('displays locked state for unearned badges', () => {
      render(<BadgeCard badge={mockBadge} />);
      
      // Should show lock overlay
      expect(screen.getByLabelText('Badge locked')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      
      // Should show progress bar
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(`${mockBadge.current_progress}/${mockBadge.requirement_value}`)).toBeInTheDocument();
    });

    it('displays earned state for completed badges', () => {
      render(<BadgeCard badge={earnedBadge} />);
      
      // Should not show lock overlay
      expect(screen.queryByLabelText('Badge locked')).not.toBeInTheDocument();
      expect(screen.getByText('✓ Earned')).toBeInTheDocument();
      
      // Should show earned date
      expect(screen.getByText('9/5/2025')).toBeInTheDocument(); // Formatted date
      
      // Should not show progress bar
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('shows ready state when progress is complete but not yet earned', () => {
      const readyBadge = {
        ...mockBadge,
        current_progress: 5 // Equals requirement_value
      };
      
      render(<BadgeCard badge={readyBadge} />);
      
      expect(screen.getByText('Ready')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toHaveClass('text-green-600');
    });
  });

  describe('Rarity System', () => {
    const rarities = ['common', 'rare', 'epic', 'legendary'] as const;
    
    rarities.forEach(rarity => {
      it(`applies correct styling for ${rarity} rarity`, () => {
        const rareBadge = { ...mockBadge, rarity };
        render(<BadgeCard badge={rareBadge} />);
        
        const cardElement = screen.getByRole('button');
        
        // Each rarity should have different border colors
        expect(cardElement).toHaveClass('border-2');
        
        if (rarity === 'legendary') {
          expect(cardElement).toHaveClass('border-yellow-400');
        } else if (rarity === 'epic') {
          expect(cardElement).toHaveClass('border-purple-400');
        }
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<BadgeCard badge={mockBadge} onClick={jest.fn()} />);
      
      // Should be clickable with proper role
      const cardButton = screen.getByRole('button');
      expect(cardButton).toBeInTheDocument();
      
      // Should have descriptive content
      expect(screen.getByText(mockBadge.name)).toBeInTheDocument();
      expect(screen.getByText(mockBadge.description)).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const mockClick = jest.fn();
      render(<BadgeCard badge={mockBadge} onClick={mockClick} />);
      
      const cardButton = screen.getByRole('button');
      
      // Should be focusable
      cardButton.focus();
      expect(cardButton).toHaveFocus();
      
      // Should respond to Enter key
      fireEvent.keyDown(cardButton, { key: 'Enter', code: 'Enter' });
      await waitFor(() => {
        expect(mockClick).toHaveBeenCalledWith(mockBadge);
      });
      
      // Should respond to Space key  
      fireEvent.keyDown(cardButton, { key: ' ', code: 'Space' });
      await waitFor(() => {
        expect(mockClick).toHaveBeenCalledTimes(2);
      });
    });

    it('provides screen reader friendly progress information', () => {
      render(<BadgeCard badge={mockBadge} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '60'); // (3/5) * 100
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      
      // Should have descriptive text for screen readers
      expect(screen.getByText(`${mockBadge.current_progress}/${mockBadge.requirement_value}`)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles image loading errors gracefully', () => {
      const badgeWithImage = {
        ...mockBadge,
        icon_url: 'https://invalid-url.com/badge.png'
      };
      
      render(<BadgeCard badge={badgeWithImage} />);
      
      const image = screen.getByRole('img');
      
      // Simulate image load error
      fireEvent.error(image);
      
      // Should fallback to icon instead of broken image
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Achievement icon')).toBeInTheDocument();
    });

    it('applies motion props correctly for smooth animations', () => {
      render(<BadgeCard badge={mockBadge} />);
      
      // Should have motion wrapper for hover effects
      const motionDiv = screen.getByRole('button').parentElement;
      expect(motionDiv).toHaveAttribute('data-framer-motion-component');
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact mode with reduced information', () => {
      render(<BadgeCard badge={mockBadge} compact={true} />);
      
      // Should show essential information only
      expect(screen.getByText(mockBadge.name)).toBeInTheDocument();
      expect(screen.getByText(`🪙 ${mockBadge.emcoin_reward}`)).toBeInTheDocument();
      
      // Should not show detailed description in compact mode
      expect(screen.queryByText(mockBadge.description)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles badge without emcoin reward', () => {
      const noRewardBadge = { ...mockBadge, emcoin_reward: 0 };
      render(<BadgeCard badge={noRewardBadge} />);
      
      expect(screen.queryByText(/🪙/)).not.toBeInTheDocument();
    });

    it('handles badge without progress tracking', () => {
      const noProgressBadge = { 
        ...mockBadge, 
        current_progress: undefined,
        requirement_value: undefined 
      };
      render(<BadgeCard badge={noProgressBadge} />);
      
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('handles very long badge names gracefully', () => {
      const longNameBadge = {
        ...mockBadge,
        name: 'This is a very long badge name that should be truncated properly in the UI'
      };
      
      render(<BadgeCard badge={longNameBadge} />);
      
      const nameElement = screen.getByText(longNameBadge.name);
      expect(nameElement).toHaveClass('line-clamp-1');
    });
  });
});

/**
 * Integration Tests (TODO for remediation session):
 * - Test with real API data
 * - Test click handlers integration with parent components
 * - Test theme switching (dark/light mode)
 * - Test responsive behavior at different screen sizes
 * - Performance testing with large lists of badges
 */