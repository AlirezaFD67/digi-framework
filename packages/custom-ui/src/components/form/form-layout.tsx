import { Card, CardContent } from "@workspace/ui/components/card";
import { ReactNode } from "react";

interface FormLayoutProps {
  /**
   * عنوان فرم
   */
  title: string;
  
  /**
   * توضیحات فرم
   */
  description?: string;
  
  /**
   * محتوای فرم
   */
  children: ReactNode;
  
  /**
   * کلاس اضافی برای کانتینر اصلی
   */
  className?: string;
  
  /**
   * کلاس اضافی برای بخش عنوان
   */
  titleClassName?: string;
  
  /**
   * کلاس اضافی برای بخش فرم
   */
  formClassName?: string;
}

export function FormLayout({
  title,
  description,
  children,
  className = "",
  titleClassName = "",
  formClassName = "",
}: FormLayoutProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${className}`}>
      {/* Title & Description Section - Left Side */}
      <div className={`lg:col-span-4 ${titleClassName}`}>
        <div className="sticky top-6">
          <h2 className="text-2xl font-bold mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className={`lg:col-span-8 ${formClassName}`}>
      <Card  >
      <CardContent className="pt-6">
        {children}
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

