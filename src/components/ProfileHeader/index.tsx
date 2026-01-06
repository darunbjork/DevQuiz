interface ProfileHeaderProps {
  name: string;
}

const ProfileHeader = ({ name }: ProfileHeaderProps) => (
  <div className="profile-header">
    <div>
      <h1 className="profile-title">Profile</h1>
      <p className="profile-subtitle">Welcome back, {name}!</p>
    </div>
  </div>
);

export default ProfileHeader;
