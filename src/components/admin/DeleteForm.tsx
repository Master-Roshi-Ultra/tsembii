import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { CheckboxField } from '@/components/ui/Field';
import type { FormState } from '@/lib/form';

/** Устгах товч: санамсаргүй дарахаас сэргийлж баталгаажуулах checkbox шаардана. */
export function DeleteForm({ action, id }: { action: () => Promise<FormState>; id: string }) {
  return (
    <ActionForm action={action} className="row">
      <CheckboxField name="confirm" id={`${id}-confirm`} label="Устгахыг баталж байна" required />
      <SubmitButton className="btn btn-danger">Устгах</SubmitButton>
    </ActionForm>
  );
}
