import { DialogFooter, DialogHeader,Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export type PolicyType = "privacy" | "conditions" | "manage" | "payment" | "responsible" | "personal";

const TermsAndConditions = () => (
  <div className="py-4 space-y-4 text-[#bfbfbf]">
    <h3 className="text-lg font-medium text-white">1. Acceptance of Terms</h3>
    <p>
      By accessing and using EmDash Debate, you agree to be bound by these Terms and Conditions. If you
      do not agree to these terms, please do not use our platform.
    </p>

    <h3 className="text-lg font-medium text-white">2. User Accounts</h3>
    <p>
      Users must provide accurate and complete information when creating an account. You are responsible
      for maintaining the confidentiality of your account credentials and for all activities that occur
      under your account.
    </p>

    <h3 className="text-lg font-medium text-white">3. Guardian Consent</h3>
    <p>
      Users under the age of 18 must have guardian consent to participate in debates. Guardian email
      verification is required for full participation in debate activities.
    </p>

    <h3 className="text-lg font-medium text-white">4. Code of Conduct</h3>
    <p>
      Users must engage respectfully in all debates and discussions. Harassment, hate speech, and
      inappropriate content are strictly prohibited. EmDash Debate reserves the right to remove content
      or suspend accounts that violate these guidelines.
    </p>

    <h3 className="text-lg font-medium text-white">5. Intellectual Property</h3>
    <p>
      Content created on the platform may be used for educational purposes. Users retain ownership of
      their original content but grant EmDash Debate a license to use, display, and distribute content
      within the platform.
    </p>

    <h3 className="text-lg font-medium text-white">6. Termination</h3>
    <p>
      EmDash Debate reserves the right to terminate or suspend accounts at its discretion for violations
      of these terms or for any other reason.
    </p>

    <h3 className="text-lg font-medium text-white">7. Changes to Terms</h3>
    <p>
      We may update these terms from time to time. Continued use of the platform after changes
      constitutes acceptance of the updated terms.
    </p>
  </div>
)

const PrivacyPolicy = () => (
  <div className="py-4 space-y-4 text-[#bfbfbf]">
    <h3 className="text-lg font-medium text-white">1. Information We Collect</h3>
    <p>
      We collect personal information such as name, username, date of birth, gender, location, school
      information, and guardian contact details. We also collect usage data to improve our services.
    </p>

    <h3 className="text-lg font-medium text-white">2. How We Use Your Information</h3>
    <p>
      We use your information to provide and improve our services, communicate with you, and ensure a
      safe environment for debates. Guardian information is used for verification and consent purposes.
    </p>

    <h3 className="text-lg font-medium text-white">3. Information Sharing</h3>
    <p>
      We do not sell your personal information. We may share information with schools, guardians (for
      users under 18), and service providers who help us operate the platform.
    </p>

    <h3 className="text-lg font-medium text-white">4. Data Security</h3>
    <p>
      We implement appropriate security measures to protect your personal information. However, no
      method of transmission over the Internet is 100% secure.
    </p>

    <h3 className="text-lg font-medium text-white">5. User Rights</h3>
    <p>
      You have the right to access, correct, or delete your personal information. You may also withdraw
      consent for certain data processing activities.
    </p>

    <h3 className="text-lg font-medium text-white">6. Children's Privacy</h3>
    <p>
      Our platform is designed for educational use, including by minors. We require guardian consent for
      users under 18 and take additional measures to protect children's privacy.
    </p>

    <h3 className="text-lg font-medium text-white">7. Changes to Privacy Policy</h3>
    <p>
      We may update this privacy policy from time to time. We will notify users of significant changes
      through the platform or via email.
    </p>
  </div>
)


const ManagePolicy = () => (
  <div className="py-4 space-y-4 text-[#bfbfbf]">
    <h3 className="text-lg font-medium text-white">1. Student Account Oversight</h3>
    <p>As a guardian, you have access to your linked students’ activity logs, performance data, and credit usage. You will not be able to impersonate the student or alter their debate content.</p>

    <h3 className="text-lg font-medium text-white">2. View-Only Access</h3>
    <p>You may review debate history and progress for educational and monitoring purposes. Editing student-generated content is not allowed.</p>

    <h3 className="text-lg font-medium text-white">3. Guardian Link Management</h3>
    <p>Guardians may be required to verify student associations via email or school-provided codes to gain full access to management tools.</p>
  </div>
);

const PaymentPolicy = () => (
  <div className="py-4 space-y-4 text-[#bfbfbf]">
    <h3 className="text-lg font-medium text-white">1. Payment Authorization</h3>
    <p>You agree to be the authorized payer for all purchases made on behalf of your linked students. This includes credit packages and premium features.</p>

    <h3 className="text-lg font-medium text-white">2. Credit Usage</h3>
    <p>Credits may be used for debate registrations, advanced analysis tools, or mentor feedback. Usage history will be recorded and available in your dashboard.</p>

    <h3 className="text-lg font-medium text-white">3. Refund Policy</h3>
    <p>All payments are final unless otherwise specified in our Refund Policy. Disputes should be reported within 7 days of transaction.</p>
  </div>
);

const ResponsibilityPolicy = () => (
  <div className="py-4 space-y-4 text-[#bfbfbf]">
    <h3 className="text-lg font-medium text-white">1. Conduct Oversight</h3>
    <p>You are responsible for ensuring your linked students follow the platform's Code of Conduct. Misuse such as harassment, cheating, or abuse may result in disciplinary action.</p>

    <h3 className="text-lg font-medium text-white">2. Limited Liability</h3>
    <p>While EmDash Debate moderates user behavior, guardians may bear partial liability under certain jurisdictions for harm caused by their linked student’s misconduct.</p>

    <h3 className="text-lg font-medium text-white">3. Reporting Issues</h3>
    <p>We encourage guardians to report any violations or concerns to our support team immediately.</p>
  </div>
);

export const PolicyDialog = ({ type } : { type: PolicyType }) => {
  let text;
  let child;
  switch (type) {
    case "conditions":
      text = "Terms and Conditions";
      child = <TermsAndConditions />;
      break;
    case "privacy":
      text = "Privacy Policy";
      child = <PrivacyPolicy />;
      break;
    case "manage":
      text = "Manage Student Accounts";
      child = <ManagePolicy />;
      break;
    case "personal":
      text = "Use of Personal Information";
      child = <PrivacyPolicy />;
      break;
    case "payment": 
      text = "Payment and Credit Responsibility";
      child = <PaymentPolicy />;
      break;
    case "responsible":
      text = "Student Conduct Oversight";
      child = <ResponsibilityPolicy />;
      break;
    default:
      text = "Policy";
      child = <div />;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-primary hover:underline cursor-pointer">
          {text}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#232328] text-white border-[#333] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
        </DialogHeader>
          {child}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" className="bg-primary hover:bg-primary/90 text-white">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
