import Card from "../Card";
import Button from "../Button";

interface EditProfileFormProps {
  /**
   * The current name value being edited. This is a required string.
   */
  editName: string;
  setEditName: (name: string) => void;
  userEmail: string;
  /**
   * Callback function to update the user profile.
   * The `data` object contains properties to update.
   * `name?: string` indicates that the 'name' property is optional.
   * If `name` is not provided in `data`, its value will be `undefined` (not `null`).
   */
  onUpdateProfile: (data: { name?: string }) => void;
}

const EditProfileForm = ({
  editName,
  setEditName,
  userEmail,
  onUpdateProfile,
}: EditProfileFormProps) => (
  <Card title="Edit Profile">
    <div className="edit-profile">
      <div>
        <label className="edit-label">Name</label>
        <input
          type="text"
          className="edit-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="edit-label">Email</label>
        <input
          type="email"
          className="edit-input"
          value={userEmail}
          disabled
        />
      </div>

      <Button onClick={() => onUpdateProfile({ name: editName })}>
        Update Name
      </Button>
    </div>
  </Card>
);

export default EditProfileForm;
