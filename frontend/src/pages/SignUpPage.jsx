import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { signup } from "../lib/api.js";
import useSignup from "../hooks/useSignup.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // const queryClient = useQueryClient();
  // const { mutate:signupMutation, isPending, error } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

// optimized signup mutation
  const {signupMutation,isPending,error} = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="coffee"
    >
      {/*-------------parent div for both right and left side segments---------- */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/*-----------------------SIGNUP FORM - LEFT SIDE-----------------------------*/}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span
              className="text-3xl font-bold font-mono bg-clip-text text-transparent 
                  bg-gradient-to-r from-primary to-secondary tracking-wider">
              LingoFreaks
            </span>
          </div>

          {/*---------------------error messages------------------- */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          {/*--------signup form------*/}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join LingoFreaks and start your language learning adventure!
                  </p>
                </div>
                {/* --------------------------actual form div name------------------ */}
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Name!"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* --------------------------actual form div email------------------ */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Email!"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  {/* -----------------------------------form div password-------------------------------- */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Password!"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                </div>
                {/*---------------------------------Signup button------------------------------------ */}
                <button className="btn btn-primary w-full" type="submit">
                  {isPending? 
                  (<>
                  <span className="loading loading-spinner loading-xs"></span>
                   Creating account...</>):
                  ("Create Account")
                  }
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/*-----------------------SIGNUP - RIGHT SIDE-----------------------------*/}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/*------------------------image of videocalling------------- */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/VideoCall.png"
                alt="language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language parteners worldwide.
              </h2>
              <p className="opacity-70">
                Practice Conversation, make friends and improve your langauge
                skills together.
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default SignUpPage;
