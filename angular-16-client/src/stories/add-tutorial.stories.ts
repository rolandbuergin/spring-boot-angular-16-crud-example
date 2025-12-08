import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { of } from 'rxjs';
import { AddTutorialComponent } from '../app/components/add-tutorial/add-tutorial.component';
import { TutorialService } from '../app/services/tutorial.service';

class MockTutorialService {
  lastPayload: any;

  create(payload: any) {
    this.lastPayload = payload;
    return of({ id: 1, ...payload });
  }
}

const meta: Meta<AddTutorialComponent> = {
  title: 'Components/AddTutorialComponent',
  component: AddTutorialComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
      providers: [{ provide: TutorialService, useClass: MockTutorialService }],
    }),
  ],
};

export default meta;

type Story = StoryObj<AddTutorialComponent>;

export const EmptyForm: Story = {
  name: 'Leeres Formular',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = await canvas.findByRole('button', { name: /submit/i });
    await expect(submitButton).toBeDisabled();
  },
};

export const SuccessfulSubmission: Story = {
  name: 'Erfolgreiche Eingabe',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText(/name/i), 'Berlin');
    await userEvent.type(canvas.getByLabelText(/description/i), 'Hauptstadt');
    await userEvent.type(canvas.getByLabelText(/einwohner/i), '3645000');

    const submitButton = await canvas.findByRole('button', { name: /submit/i });
    await expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await expect(await canvas.findByText(/submitted successfully/i)).toBeInTheDocument();
  },
};
