
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    displayName: "Alex Johnson",
    email: "alex@example.com",
    avatar: "", // URL would go here in a real app
  });

  const [notifications, setNotifications] = useState({
    roomInvites: true,
    decisions: true,
    appUpdates: false,
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload the file to storage
    // and update the avatar URL in the profile data
    console.log("Avatar file selected:", e.target.files?.[0]);
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated.",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password change requested",
      description: "Check your email for instructions to reset your password.",
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and how others see you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <UserAvatar
                src={profileData.avatar}
                name={profileData.displayName}
                size="lg"
                status="online"
              />
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <span className="text-sm text-dicey-purple">Change photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="space-y-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      displayName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={profileData.email} disabled />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleProfileUpdate}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            For security reasons, we'll send you a link to change your password via email.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control how and when you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="roomInvites">Room Invites</Label>
              <p className="text-sm text-muted-foreground">
                Notify me when someone invites me to a decision room
              </p>
            </div>
            <Switch
              id="roomInvites"
              checked={notifications.roomInvites}
              onCheckedChange={() => handleNotificationChange("roomInvites")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="decisions">Decision Results</Label>
              <p className="text-sm text-muted-foreground">
                Notify me when decisions are made in my rooms
              </p>
            </div>
            <Switch
              id="decisions"
              checked={notifications.decisions}
              onCheckedChange={() => handleNotificationChange("decisions")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appUpdates">App Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive news about new features and improvements
              </p>
            </div>
            <Switch
              id="appUpdates"
              checked={notifications.appUpdates}
              onCheckedChange={() => handleNotificationChange("appUpdates")}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast({ title: "Notification preferences saved" })}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
