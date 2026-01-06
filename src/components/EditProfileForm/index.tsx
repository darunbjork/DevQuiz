import Card from "../Card";
import Button from "../Button";

interface EditProfileFormProps {
  editName: string;
  setEditName: (name: string) => void;
  userEmail: string;
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
