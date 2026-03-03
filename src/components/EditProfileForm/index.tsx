import Card from "../Card";
import Button from "../Button";

interface EditProfileFormProps {
  /**
   * The current username value being edited. This is a required string.
   */
  editUsername: string;
  setEditUsername: (username: string) => void;
  userEmail: string;
  /**
   * Callback function to update the user profile.
   * The `data` object contains properties to update.
   * `username?: string` indicates that the 'username' property is optional.
   */
  onUpdateProfile: (data: { username?: string }) => void;
}

const EditProfileForm = ({
  editUsername,
  setEditUsername,
  userEmail,
  onUpdateProfile,
}: EditProfileFormProps) => (
  <Card title="Edit Profile">
    <div className="edit-profile">
      <div>
        <label className="edit-label">Username</label>
        <input
          type="text"
          className="edit-input"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          placeholder="Your username"
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

      <Button onClick={() => onUpdateProfile({ username: editUsername })}>
        Update Username
      </Button>
    </div>
  </Card>
);

export default EditProfileForm;
