interface ProfileHeaderProps {
  username: string;
}

const ProfileHeader = ({ username }: ProfileHeaderProps) => (
  <div className="profile-header">
    <div>
      <h1 className="profile-title">Profile</h1>
      <p className="profile-subtitle">Welcome back, {username}!</p>
    </div>
  </div>
);

export default ProfileHeader;
