import { api } from '../../api.js';
import UserForm from '../UserForm.jsx';

export default function AddUserTab({ onAdded }) {
  async function addUser(values) {
    await api('/admin/users', { method: 'POST', body: values });
    onAdded();
  }

  return (
    <section className="card max-w-xl">
      <h3 className="mb-4 text-lg font-bold">Add a new user</h3>
      <UserForm onSubmit={addUser} buttonText="Add user" showRole successText="User added." />
    </section>
  );
}
