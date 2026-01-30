import TestIndex from "@/pages/test/TestIndex";
import TestGnb from "@/pages/test/TestGnb";
import TestButton from "@/pages/test/TestButton";
import TestBadge from "@/pages/test/TestBadge";
import TestCalendar from "@/pages/test/TestCalendar";
import TestToast from "@/pages/test/TestToast";

export const testRoutes = [
  {
    path: "/test",
    element: <TestIndex />,
  },
  {
    path: "/test/gnb",
    element: <TestGnb />,
  },
  {
    path: "/test/button",
    element: <TestButton />,
  },
  {
    path: "/test/badge",
    element: <TestBadge />,
  },
  {
    path: "/test/calendar",
    element: <TestCalendar />,
  },
  {
    path: "/test/toast",
    element: <TestToast />,
  },
];
