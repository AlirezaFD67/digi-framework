"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useAuthContext,
  FormProvider,
  RHFInput,
  RHFSelect,
  validationRules,
  commonValidations,
  useToast,
  FormButton,
  FormLayout,
  Button
} from "@workspace/custom-ui";
import { useUpdateUserProfileMutation } from "@workspace/framework";
import { IUpdateUserProfileRequest } from "@workspace/framework";
import { CardContent, Card } from "@workspace/ui/components/card";

export default function ProfilePage() {
  const { user, withAuth } = useAuthContext();
  const { success, error } = useToast();
  const updateUserMutation = useUpdateUserProfileMutation();

  // User form
  const methods = useForm<IUpdateUserProfileRequest>({
    defaultValues: {
      state_ID: user?.state_ID || 0,
      city_ID: user?.city_ID || 0,
      user_Melli: "",
      user_Name: user?.user_Name || "",
      user_Family: user?.user_Family || "",
      user_Sex: user?.user_Sex || 1,
      user_Age: user?.user_Age || 0,
      user_Height: user?.user_Height || 0,
      user_Weight: user?.user_Weight || 0,
      user_Blood: user?.user_Blood || 0,
      user_Adr: user?.user_Adr || "",
      user_Lat: user?.user_Lat || 0,
      user_Lon: user?.user_Lon || 0,
    }
  });

  // Update user form values when user data changes
  useEffect(() => {
    if (user) {
      methods.reset({
        state_ID: user.state_ID || 0,
        city_ID: user.city_ID || 0,
        user_Melli: "",
        user_Name: user.user_Name || "",
        user_Family: user.user_Family || "",
        user_Sex: user.user_Sex || 1,
        user_Age: user.user_Age || 0,
        user_Height: user.user_Height || 0,
        user_Weight: user.user_Weight || 0,
        user_Blood: user.user_Blood || 0,
        user_Adr: user.user_Adr || "",
        user_Lat: user.user_Lat || 0,
        user_Lon: user.user_Lon || 0,
      });
    }
  }, [user, methods]);

  const onSubmit = async (data: IUpdateUserProfileRequest) => {
    try {
      await updateUserMutation.mutateAsync(data);
      success("پروفایل کاربر با موفقیت به‌روزرسانی شد", "موفقیت");
    } catch (err) {
      error("خطا در به‌روزرسانی پروفایل کاربر", "خطا");
    }
  };

  const genderOptions = [
    { value: 1, label: "مرد" },
    { value: 2, label: "زن" }
  ];

  const bloodOptions = [
    { value: 0, label: "نامشخص" },
    { value: 1, label: "A+" },
    { value: 2, label: "A-" },
    { value: 3, label: "B+" },
    { value: 4, label: "B-" },
    { value: 5, label: "AB+" },
    { value: 6, label: "AB-" },
    { value: 7, label: "O+" },
    { value: 8, label: "O-" }
  ];

  return (
    <div>

      <FormLayout
        title="ویرایش پروفایل کاربری"
        description="اطلاعات شخصی، جسمانی و آدرس خود را در این بخش مدیریت کنید. این اطلاعات برای ارائه خدمات بهتر به شما استفاده می‌شود."
      >
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="user_Name"
              label="نام"
              placeholder="نام خود را وارد کنید"
              required
              {...commonValidations.name}
            />

            <RHFInput
              name="user_Family"
              label="نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
              required
              {...commonValidations.name}
            />

            <RHFInput
              name="user_Melli"
              label="کد ملی"
              placeholder="کد ملی خود را وارد کنید"
              required
              {...validationRules.pattern(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")}
            />

            <RHFSelect
              name="user_Sex"
              label="جنسیت"
              options={genderOptions}
              required
            />
          </div>

          {/* Physical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="user_Age"
              label="سن"
              type="number"
              placeholder="سن خود را وارد کنید"
              required
            />

            <RHFSelect
              name="user_Blood"
              label="گروه خونی"
              options={bloodOptions}
            />

            <RHFInput
              name="user_Height"
              label="قد (سانتی‌متر)"
              type="number"
              placeholder="قد خود را وارد کنید"
            />

            <RHFInput
              name="user_Weight"
              label="وزن (کیلوگرم)"
              type="number"
              placeholder="وزن خود را وارد کنید"
            />
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="state_ID"
              label="شناسه استان"
              type="number"
              placeholder="شناسه استان"
              required
            />

            <RHFInput
              name="city_ID"
              label="شناسه شهر"
              type="number"
              placeholder="شناسه شهر"
              required
            />
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <RHFInput
              name="user_Adr"
              label="آدرس"
              placeholder="آدرس کامل خود را وارد کنید"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RHFInput
                name="user_Lat"
                label="عرض جغرافیایی"
                type="number"
                placeholder="Latitude"
                step="any"
              />

              <RHFInput
                name="user_Lon"
                label="طول جغرافیایی"
                type="number"
                placeholder="Longitude"
                step="any"
              />
            </div>
          </div>

          {/* Submit Button */}
          <FormButton
            mode="edit"
            loading={updateUserMutation.isPending}
            onReset={() => methods.reset()}
            submitButtonText="به‌روزرسانی پروفایل"
          />
        </FormProvider>
      </FormLayout>
    </div>
  );
}