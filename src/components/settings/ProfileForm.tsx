import { Profile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileFormProps {
  profile: Profile | undefined;
  userEmail: string | undefined;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({ profile, userEmail, isSubmitting, onSubmit }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            name="fullName"
            defaultValue={profile?.full_name || ''}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={userEmail || ''}
            disabled
            className="bg-gray-50"
          />
          <p className="text-sm text-gray-500">
            Email can only be changed through account settings
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            name="phone"
            type="tel"
            defaultValue={profile?.phone || ''}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <Input
            name="company"
            defaultValue={profile?.company || ''}
            placeholder="Enter your company name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Title</label>
          <Input
            name="jobTitle"
            defaultValue={profile?.job_title || ''}
            placeholder="Enter your job title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            name="location"
            defaultValue={profile?.location || ''}
            placeholder="Enter your location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <Input
          name="website"
          type="url"
          defaultValue={profile?.website || ''}
          placeholder="Enter your website URL"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={profile?.bio || ''}
          placeholder="Tell us about yourself"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Save Changes
      </Button>
    </form>
  );
};