"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetMyInfo, useUpdateMyInfo } from "@/hooks/queries/useUser";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { showErrorToast } from "@/components/ui/ErrorToast";
import CtaButton from "@/components/ui/CtaButton";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";

interface ProfileFormData {
  username: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  day: string;
  month: string;
  year: string;
}

const ProfilePage = () => {
  // Lấy thông tin user từ API
  const { getMyInfo } = useGetMyInfo();
  const updateProfileMutation = useUpdateMyInfo();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      phone: "",
      gender: "",
      day: "",
      month: "",
      year: "",
    },
  });

  // Khi có data user, set lại giá trị form
  useEffect(() => {
    if (getMyInfo.data) {
      setValue("username", getMyInfo.data.username || "");
      setValue("name", getMyInfo.data.name || "");
      setValue("email", getMyInfo.data.email || "");
      setValue("phone", getMyInfo.data.phoneNumber || "");
      setValue("gender", getMyInfo.data.gender || "");
      setValue(
        "day",
        getMyInfo.data.dayOfBirth ? String(getMyInfo.data.dayOfBirth) : "",
      );
      setValue(
        "month",
        getMyInfo.data.monthOfBirth ? String(getMyInfo.data.monthOfBirth) : "",
      );
      setValue(
        "year",
        getMyInfo.data.yearOfBirth ? String(getMyInfo.data.yearOfBirth) : "",
      );
    }
  }, [getMyInfo.data, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        name: data.name,
        phoneNumber: data.phone,
        gender: data.gender,
        dayOfBirth: data.day ? Number(data.day) : undefined,
        monthOfBirth: data.month ? Number(data.month) : undefined,
        yearOfBirth: data.year ? Number(data.year) : undefined,
      });
      showSuccessToast("Profile updated successfully!");
    } catch {
      showErrorToast("Failed to update profile!");
    }
  };

  if (getMyInfo.isLoading) {
    return (
      <div className="min-h-screen bg-custom-yellow py-4 md:py-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-wine mx-auto mb-4"></div>
            <p className="text-custom-dark">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (getMyInfo.isError) {
    return (
      <div className="min-h-screen bg-custom-yellow py-4 md:py-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold mb-4 text-custom-dark">
              Failed to load profile
            </h2>
            <p className="text-custom-purple">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-custom-yellow">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-custom-rose to-custom-pink p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white text-custom-wine rounded-full p-3 shadow-lg">
                <FaUser className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">My Profile</h2>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Username Field */}
              <div className="relative">
                <label className="text-base font-semibold mb-2 text-custom-dark flex items-center gap-2">
                  <FaUser className="text-custom-wine" /> Username
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 bg-gray-50 text-gray-500 cursor-not-allowed text-base shadow-sm transition-all"
                  disabled
                  {...register("username")}
                />
                <FaUser className="absolute left-4 top-11 text-gray-400 text-lg pointer-events-none" />
              </div>

              {/* Name Field */}
              <div className="relative">
                <label className="text-base font-semibold mb-2 text-custom-dark flex items-center gap-2">
                  <FaUser className="text-custom-wine" /> Full Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:ring-2 focus:ring-custom-wine focus:border-custom-wine focus:outline-none text-base shadow-sm transition-all hover:border-custom-rose"
                  placeholder="Enter your full name"
                  {...register("name", { required: "Name is required" })}
                />
                <FaUser className="absolute left-4 top-11 text-gray-400 text-lg pointer-events-none" />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {errors.name.message as string}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="text-base font-semibold mb-2 text-custom-dark flex items-center gap-2">
                  <FaEnvelope className="text-custom-wine" /> Email Address
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 bg-gray-50 text-gray-500 cursor-not-allowed text-base shadow-sm transition-all"
                  disabled
                  {...register("email")}
                />
                <FaEnvelope className="absolute left-4 top-11 text-gray-400 text-lg pointer-events-none" />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <label className="text-base font-semibold mb-2 text-custom-dark flex items-center gap-2">
                  <FaPhone className="text-custom-wine" /> Phone Number
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:ring-2 focus:ring-custom-wine focus:border-custom-wine focus:outline-none text-base shadow-sm transition-all hover:border-custom-rose"
                  placeholder="Enter your phone number"
                  {...register("phone")}
                />
                <FaPhone className="absolute left-4 top-11 text-gray-400 text-lg pointer-events-none" />
              </div>

              {/* Gender Selection */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="text-base font-semibold text-custom-dark flex items-center gap-2 mb-3">
                  <FaVenusMars className="text-custom-wine" /> Gender
                </span>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-custom-dark cursor-pointer hover:text-custom-wine transition-colors">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender")}
                      className="accent-custom-wine w-4 h-4"
                    />
                    <span className="select-none">Male</span>
                  </label>
                  <label className="flex items-center gap-2 text-custom-dark cursor-pointer hover:text-custom-wine transition-colors">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender")}
                      className="accent-custom-wine w-4 h-4"
                    />
                    <span className="select-none">Female</span>
                  </label>
                  <label className="flex items-center gap-2 text-custom-dark cursor-pointer hover:text-custom-wine transition-colors">
                    <input
                      type="radio"
                      value="other"
                      {...register("gender")}
                      className="accent-custom-wine w-4 h-4"
                    />
                    <span className="select-none">Other</span>
                  </label>
                </div>
              </div>

              {/* Birth Date */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="text-base font-semibold text-custom-dark flex items-center gap-2 mb-3">
                  <FaBirthdayCake className="text-custom-wine" /> Date of Birth
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:ring-2 focus:ring-custom-wine focus:border-custom-wine focus:outline-none text-base shadow-sm transition-all hover:border-custom-rose"
                      placeholder="Day"
                      type="number"
                      min="1"
                      max="31"
                      {...register("day")}
                    />
                    <FaBirthdayCake className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:ring-2 focus:ring-custom-wine focus:border-custom-wine focus:outline-none text-base shadow-sm transition-all hover:border-custom-rose"
                      placeholder="Month"
                      type="number"
                      min="1"
                      max="12"
                      {...register("month")}
                    />
                    <FaBirthdayCake className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-12 py-3 focus:ring-2 focus:ring-custom-wine focus:border-custom-wine focus:outline-none text-base shadow-sm transition-all hover:border-custom-rose"
                      placeholder="Year"
                      type="number"
                      min="1900"
                      max="2025"
                      {...register("year")}
                    />
                    <FaBirthdayCake className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <CtaButton
                  type="submit"
                  text="Save Profile"
                  onClick={() => {}} // The actual submission is handled by the form onSubmit
                  variant="profile"
                  isLoading={updateProfileMutation.isPending}
                  loadingText="Saving Changes..."
                  icon={<FaUser />}
                  loadingIcon={<FaUser />}
                  disabled={updateProfileMutation.isPending}
                  className="w-full py-3"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h4 className="font-semibold mb-3 text-custom-dark flex items-center">
            <span className="mr-2">ℹ️</span>
            Account Information
          </h4>
          <div className="text-sm text-custom-purple space-y-1">
            <p>• Username and email cannot be changed after registration</p>
            <p>• Your personal information is secure and encrypted</p>
            <p>• Contact support if you need to update restricted fields</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
