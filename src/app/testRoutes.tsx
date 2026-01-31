import TestIndex from "@/pages/test/TestIndex";
import TestGnb from "@/pages/test/TestGnb";
import TestButton from "@/pages/test/TestButton";
import TestBadge from "@/pages/test/TestBadge";
import TestTodo from "@/pages/test/TestTodo";
import TestCalendar from "@/pages/test/TestCalendar";

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
    path: "/test/todo",
    element: <TestTodo />,
    path: "/test/calendar",
    element: <TestCalendar />,
  },
];
