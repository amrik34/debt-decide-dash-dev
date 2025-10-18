import { UserPlus, FileText, Building2, CreditCard, Award, Globe, Wand2 } from "lucide-react";
import WelcomeBanner from "@/components/WelcomeBanner";
import ProgressTracker from "@/components/ProgressTracker";
import QuickStartCard from "@/components/QuickStartCard";
import PersonalTasks from "@/components/PersonalTasks";
import BusinessStatus from "@/components/BusinessStatus";
import TodaysSchedule from "@/components/TodaysSchedule";
import RecentLoginActivity from "@/components/RecentLoginActivity";

const Home = () => {
  const quickStartTasks = [
    {
      icon: UserPlus,
      title: "Add a New Client",
      description: "Sign up a new client and add to database",
      number: 1,
    },
    {
      icon: UserPlus,
      title: "Select an Existing Client",
      description: "Work with an existing client",
      number: 2,
    },
    {
      icon: Wand2,
      title: "Run Credit Dispute Wizard",
      description: "Order reports, review reports, correct errors",
      number: 3,
    },
  ];

  const actionCards = [
    {
      icon: Building2,
      title: "My Company",
      description: "Configure users, permissions, billing",
      color: "text-blue-600",
    },
    {
      icon: Award,
      title: "Take the Start Repairing Credit Challenge",
      description: "Credit repair training and certificate",
      color: "text-blue-600",
    },
    {
      icon: CreditCard,
      title: "Get a Merchant Account",
      description: "Accept credit card payments from clients",
      color: "text-blue-600",
    },
    {
      icon: Globe,
      title: "Get a Business Website",
      description: "Get a professional site in minutes",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <WelcomeBanner />

        <h1 className="text-3xl font-bold mb-6">Hello Credit Hero!</h1>

        <ProgressTracker />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5">
            <h2 className="text-xl font-semibold mb-4">
              Quick Start <span className="text-muted-foreground font-normal">(Your most common tasks)</span>
            </h2>
            <div className="space-y-3">
              {quickStartTasks.map((task) => (
                <QuickStartCard
                  key={task.number}
                  icon={task.icon}
                  title={task.title}
                  description={task.description}
                  number={task.number}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionCards.map((card, index) => (
                <QuickStartCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  color={card.color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-5 space-y-6">
            <PersonalTasks />
            <BusinessStatus />
          </div>
          
          <div className="lg:col-span-7">
            <TodaysSchedule />
          </div>
        </div>

        <RecentLoginActivity />
      </div>
    </div>
  );
};

export default Home;
