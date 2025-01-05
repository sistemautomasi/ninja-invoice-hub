import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface ProfileAvatarProps {
  profile: Profile | undefined;
  userEmail: string | undefined;
}

export const ProfileAvatar = ({ profile, userEmail }: ProfileAvatarProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full w-8 h-8"
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <h3 className="font-medium">{profile?.full_name || 'Your Name'}</h3>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
      </div>
    </div>
  );
};