import Card from "../Card";
import Button from "../Button";

interface EditProfileFormProps {
 
  editUsername: string;
  setEditUsername: (username: string) => void;
  userEmail: string;
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
