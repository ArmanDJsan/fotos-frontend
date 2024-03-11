import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import VotingList from "./pages/dashboard/VotingList";
import BillList from "./pages/dashboard/BillList";
import FormVoting from "./pages/dashboard/FormVoting";
import CreateBills from "./pages/dashboard/CreateBills";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "votings",
        path: "/votings",
        element: <VotingList />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "bills",
        path: "/bills",
        element: <BillList />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "formvoting",
        path: "/formvoting",
        element: <FormVoting />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "createBills",
        path: "/createBills",
        element: <CreateBills />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
