export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  role: 'donor' | 'volunteer' | 'beneficiary' | 'ngo_partner' | 'member' | 'moderator' | 'admin' | 'super_admin' | 'ngo_staff' | 'csr' | 'strategic_partner' | 'campaign_supporter' | 'public_supporter';
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'under_review';
  phoneNumber?: string;
  reputation: number;
  ngoDetails?: {
    orgName: string;
    regNumber: string;
    website?: string;
  };
  beneficiaryDetails?: {
    helpType: string;
    description: string;
  };
  staffDetails?: {
    department: string;
    designation: string;
  };
  volunteerDetails?: {
    primarySkill: string;
    availableHours: string;
  };
  provider: 'google' | 'email' | 'phone';
  panNumber?: string;
  skills?: string[];
  availableDays?: string[];
  location?: string;
  profession?: string;
  createdAt: any;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Education' | 'Food' | 'Health' | 'Disaster Relief';
  imageUrl?: string;
  status: 'active' | 'completed';
  deadline?: any;
  createdBy: string;
  createdAt: any;
}

export interface Donation {
  id: string;
  campaignId?: string;
  amount: number;
  donorName: string;
  donorId?: string;
  isAnonymous: boolean;
  message?: string;
  paymentId?: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: any;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: any;
}

export interface Activity {
  id: string;
  type: 'join' | 'profile_update' | 'post_update';
  userId: string;
  userName: string;
  userPhoto?: string;
  details?: string;
  createdAt: any;
}

export interface FoundationUpdate {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  authorRole?: string;
  imageUrl?: string;
  likesCount?: number;
  likedBy?: string[];
  createdAt: any;
}

export interface ReportedUpdate {
  id: string;
  updateId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  createdAt: any;
}

export interface Comment {
  id: string;
  updateId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: any;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category?: string;
  createdAt: any;
}

export interface ImpactStats {
  peopleHelped: number;
  mealsServed: number;
  studentsSupported: number;
  totalFundsRaised: number;
  fundsUsedBreakdown: {
    education: number;
    health: number;
    relief: number;
    operations: number;
  };
}

export interface Volunteer {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  skills: string[];
  totalHours: number;
  eventsJoined: string[];
  status: 'pending' | 'active' | 'inactive';
  joinedAt: any;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: any;
}

export interface BeforeAfterImage {
  id: string;
  title: string;
  beforeUrl: string;
  afterUrl: string;
  description: string;
  location: string;
  createdAt: any;
}
