import { CardFooter } from "@workspace/ui/components/card";
import { RHFButton } from "./index";

interface FormButtonProps {
  /**
   * حالت فرم (ایجاد یا ویرایش)
   */
  mode?: "create" | "edit";
  
  /**
   * وضعیت لودینگ
   */
  loading?: boolean;
  
  /**
   * تابع بازگشت به مقادیر اولیه
   */
  onReset?: () => void;
  
  /**
   * متن دکمه ثبت
   */
  submitButtonText?: string;
  
  /**
   * متن دکمه بازگشت
   */
  resetButtonText?: string;
  
  /**
   * متن لودینگ
   */
  loadingText?: string;
  
  /**
   * نمایش دکمه بازگشت
   */
  showResetButton?: boolean;
  
  /**
   * کلاس اضافی
   */
  className?: string;
}

export function FormButton({
  mode = "create",
  loading = false,
  onReset,
  submitButtonText,
  resetButtonText,
  loadingText,
  showResetButton = true,
  className = "",
}: FormButtonProps) {
  // تعیین متن‌های پیش‌فرض بر اساس حالت
  const defaultSubmitText = mode === "edit" ? "به‌روزرسانی" : "ثبت";
  const defaultLoadingText = mode === "edit" ? "در حال به‌روزرسانی..." : "در حال ثبت...";
  const defaultResetText = "بازگشت ";

  return (
    <CardFooter className={`flex  right-0 sticky -bottom-7 bg-sidebar justify-end gap-4 md:mx-0 -mx-5 px-2 py-6 rounded-lg ${className}`}>
      {showResetButton && (
        <RHFButton 
          type="button" 
          variant="outline"
          onClick={onReset}
          disabled={loading}
        >
          {resetButtonText || defaultResetText}
        </RHFButton>
      )}
      
      <RHFButton 
        type="submit"
        loading={loading}
        loadingText={loadingText || defaultLoadingText}
      >
        
        {submitButtonText || defaultSubmitText}
      </RHFButton>
    </CardFooter>
  );
}