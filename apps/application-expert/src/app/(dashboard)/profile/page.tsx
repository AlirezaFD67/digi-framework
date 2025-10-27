"use client";

import { useForm } from "react-hook-form";
import { 
  Button, 
  useAuthContext,
  FormProvider,
  RHFInput,
  RHFSelect,
  RHFButton,
  validationRules,
  commonValidations,
  useToast
} from "@workspace/custom-ui";
import { useInsertDoctorProfileMutation } from "@workspace/framework";
import { LogOutIcon, UserIcon } from "lucide-react";
import { IInsertDoctorProfileRequest } from "@workspace/framework";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();
  const { success, error } = useToast();
  const insertDoctorMutation = useInsertDoctorProfileMutation();

  const methods = useForm<IInsertDoctorProfileRequest>({
    defaultValues: {
      proID: 0,
      stateID: 0,
      cityID: 0,
      docNezam: 0,
      docMelli: "",
      docName: "",
      docNameEn: "",
      docFamily: "",
      docFamilyEn: "",
      docSex: 1,
      docSpc: 0,
      docsub: 0,
      docTel: "",
      docExp: 0,
      visitPrice: 0,
      accCall: 0,
      accChat: 0,
      accOffice: 0,
    }
  });

  const onSubmit = async (data: IInsertDoctorProfileRequest) => {
    try {
      await insertDoctorMutation.mutateAsync(data);
      success("پروفایل پزشک با موفقیت ثبت شد", "موفقیت");
      methods.reset();
    } catch (err) {
      error("خطا در ثبت پروفایل پزشک", "خطا");
    }
  };

  const genderOptions = [
    { value: 1, label: "مرد" },
    { value: 2, label: "زن" }
  ];

  const accessOptions = [
    { value: 0, label: "غیرفعال" },
    { value: 1, label: "فعال" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            اطلاعات کاربری
          </h1>
        </div>
        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-semibold">نام:</span> {user?.user_Name || ""}
          </p>
          <p className="text-lg">
            <span className="font-semibold">نام خانوادگی:</span> {user?.user_Family || ""}
          </p>
          <p className="text-lg">
            <span className="font-semibold">شماره تماس:</span> {user?.user_Phone || ""}
          </p>
        </div>
        <Button 
          onClick={logout}
          variant="outline"
          className="mt-4"
        >
          <LogOutIcon className="h-4 w-4 mr-2" />
          خروج از حساب
        </Button>
      </div>

      {/* Doctor Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          ثبت پروفایل پزشک
        </h2>

        <FormProvider 
          methods={methods} 
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="docName"
              label="نام (فارسی)"
              placeholder="نام خود را وارد کنید"
              required
              {...commonValidations.name}
            />
            
            <RHFInput
              name="docNameEn"
              label="نام (انگلیسی)"
              placeholder="Enter your first name"
              required
            />
            
            <RHFInput
              name="docFamily"
              label="نام خانوادگی (فارسی)"
              placeholder="نام خانوادگی خود را وارد کنید"
              required
              {...commonValidations.name}
            />
            
            <RHFInput
              name="docFamilyEn"
              label="نام خانوادگی (انگلیسی)"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="docMelli"
              label="کد ملی"
              placeholder="کد ملی خود را وارد کنید"
              required
              {...validationRules.pattern(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")}
            />
            
            <RHFInput
              name="docNezam"
              label="شماره نظام پزشکی"
              type="number"
              placeholder="شماره نظام پزشکی"
              required
            />
            
            <RHFSelect
              name="docSex"
              label="جنسیت"
              options={genderOptions}
              required
            />
            
            <RHFInput
              name="docTel"
              label="شماره تماس"
              mode="phone"
              placeholder="شماره تماس خود را وارد کنید"
              required
              {...validationRules.iranianPhone()}
            />
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="proID"
              label="شناسه استان"
              type="number"
              placeholder="شناسه استان"
              required
            />
            
            <RHFInput
              name="stateID"
              label="شناسه شهرستان"
              type="number"
              placeholder="شناسه شهرستان"
              required
            />
            
            <RHFInput
              name="cityID"
              label="شناسه شهر"
              type="number"
              placeholder="شناسه شهر"
              required
            />
            
            <RHFInput
              name="docSpc"
              label="شناسه تخصص"
              type="number"
              placeholder="شناسه تخصص"
              required
            />
            
            <RHFInput
              name="docsub"
              label="شناسه زیرتخصص"
              type="number"
              placeholder="شناسه زیرتخصص"
            />
            
            <RHFInput
              name="docExp"
              label="سال تجربه"
              type="number"
              placeholder="سال تجربه کاری"
              required
            />
          </div>

          {/* Pricing and Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RHFInput
              name="visitPrice"
              label="قیمت ویزیت (تومان)"
              type="number"
              placeholder="قیمت ویزیت"
              required
            />
            
            <RHFSelect
              name="accCall"
              label="دسترسی تماس تلفنی"
              options={accessOptions}
              required
            />
            
            <RHFSelect
              name="accChat"
              label="دسترسی چت آنلاین"
              options={accessOptions}
              required
            />
            
            <RHFSelect
              name="accOffice"
              label="دسترسی ویزیت حضوری"
              options={accessOptions}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <RHFButton 
              type="button" 
              variant="outline"
              onClick={() => methods.reset()}
            >
              پاک کردن فرم
            </RHFButton>
            
            <RHFButton 
              type="submit"
              loading={insertDoctorMutation.isPending}
              loadingText="در حال ثبت..."
            >
              ثبت پروفایل پزشک
            </RHFButton>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}