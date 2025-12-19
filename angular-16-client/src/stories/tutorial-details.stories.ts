import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TutorialDetailsComponent } from '../app/components/tutorial-details/tutorial-details.component';
import { TutorialService } from '../app/services/tutorial.service';
import { AuthService } from '../app/services/auth.service';

class MockTutorialService {
  update() {
    return of({ message: 'This tutorial was updated successfully!' });
  }
}

class MockAuthService {
  isAuthenticated(): boolean {
    return true;
  }
}

const baseTutorial = {
  id: 1,
  title: 'Beispieltitel',
  description: 'Beschreibung',
  einwohner: 1000,
  published: false,
};

const meta: Meta<TutorialDetailsComponent> = {
  title: 'Components/TutorialDetailsComponent',
  component: TutorialDetailsComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: TutorialService, useClass: MockTutorialService },
        { provide: AuthService, useClass: MockAuthService }
      ],
    }),
  ],
  args: {
    viewMode: true,
    currentTutorial: baseTutorial,
  },
};

export default meta;

type Story = StoryObj<TutorialDetailsComponent>;

export const ReadonlyView: Story = {
  name: 'Anzeige in der Liste',
};

export const UpdateInteraction: Story = {
  name: 'Interaktives Update',
  args: {
    viewMode: false,
    currentTutorial: { ...baseTutorial },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleInput = canvas.getByLabelText(/name/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Aktualisiert');

    const submitButton = canvas.getByRole('button', { name: /update/i });
    await expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);
    await expect(await canvas.findByText(/updated successfully/i)).toBeInTheDocument();
  },
};
