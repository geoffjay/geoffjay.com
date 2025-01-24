import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";

// import { Button } from "@/components/ui/button";

import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Protected } from "@/pages/Protected";
import { RequireAuth } from "@/components/RequireAuth";

import { PocketbaseProvider } from "@/lib/context/PocketbaseContext";

const routes = [
  {
    path: "/",
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <Protected />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});

// const App = () => {
//   return (
//     <div className="flex flex-col h-screen text-slate-800">
//       <div className="flex justify-center items-center h-screen">
//         <div className="flex flex-col gap-4">
//           <Button>
//             <div className="flex gap-2">
//               <FontAwesomeIcon icon={faGithub} />
//               <p>Login with GitHub</p>
//             </div>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

export const App = () => {
  return (
    <PocketbaseProvider>
      <RouterProvider router={router} />
    </PocketbaseProvider>
  );
};

// <BrowserRouter>
//   <Routes>
//     <Route index element={<SignUp />} />
//     <Route path="/sign-in" element={<SignIn />} />
//     <Route element={<RequireAuth />}>
//       <Route path="/protected" element={<Protected />} />
//     </Route>
//   </Routes>
// </BrowserRouter>

export default App;
