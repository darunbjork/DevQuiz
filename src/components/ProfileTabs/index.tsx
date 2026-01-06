interface ProfileTabsProps {
  activeTab: "history" | "analytics";
  onTabChange: (tab: "history" | "analytics") => void;
}

const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => (
  <div className="profile-tabs">
    <button
      className={`tab-btn ${activeTab === "history" ? "tab-active" : ""}`}
      onClick={() => onTabChange("history")}
    >
      Quiz History
    </button>
    <button
      className={`tab-btn ${activeTab === "analytics" ? "tab-active" : ""}`}
      onClick={() => onTabChange("analytics")}
    >
      Analytics
    </button>
  </div>
);

export default ProfileTabs;
