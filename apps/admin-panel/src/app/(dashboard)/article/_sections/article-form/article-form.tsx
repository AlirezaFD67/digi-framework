"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  FileUp,
  Settings,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

import {
  useAdminCategoryListQuery,
  useAuthorsListQuery,
  useDoctorsListQuery,
} from "@workspace/framework";
import {
  Button,
  Card,
  Input,
  SearchableSelect,
  SimpleRichEditor,
  UploadBox,
  useToast,
} from "@workspace/custom-ui";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ArticleFormProps {
  onSaveBasic: (data: any) => Promise<string>;
  onSaveDetails: (data: any, articleId: string) => Promise<void>;
  initialValues?: Partial<ArticleData>;
  initialArticleId?: string;
  mode?: "create" | "edit";
}

interface ArticleData {
  catID: string;
  itmTitle: string;
  itmMinimal: string;
  itmMetaDesc: string;
  itmSlug: string;
  narID: string;
  docID: string;
  readTime?: string;
  coverImage?: File | null;
  thumbImage?: File | null;
  coverImageUrl?: string;
  thumbImageUrl?: string;
}

interface TabStatus {
  basic: "pending" | "saved" | "error";
  details: "pending" | "saved" | "error";
  files: "pending" | "saved" | "error";
  final: "pending" | "saved" | "error";
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ArticleForm({
  onSaveBasic,
  onSaveDetails,
  initialValues,
  initialArticleId,
  mode = "create",
}: ArticleFormProps) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const router = useRouter();
  // const { success: showSuccess, error: showError } = useToast();
  const showSuccess = (msg: string) => alert(msg);
  const showError = (msg: string) => alert(msg);
  const { data: categories, isLoading: categoriesLoading } = useAdminCategoryListQuery();

  const [articleData, setArticleData] = useState<ArticleData>({
    catID: "",
    itmTitle: "",
    itmMinimal: "",
    itmMetaDesc: "",
    itmSlug: "",
    narID: "0",
    docID: "0",
    readTime: "",
    coverImage: null,
    thumbImage: null,
    coverImageUrl: "",
    thumbImageUrl: "",
  });

  const [articleId, setArticleId] = useState<string>("");
  const [tabStatus, setTabStatus] = useState<TabStatus>({
    basic: "pending",
    details: "pending",
    files: "pending",
    final: "pending",
  });
  const [isSaving, setIsSaving] = useState<string>("");
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [debouncedAuthorSearch, setDebouncedAuthorSearch] = useState<string>("");
  const [doctorSearch, setDoctorSearch] = useState<string>("");
  const [debouncedDoctorSearch, setDebouncedDoctorSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>("");
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string>("");

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAuthorSearch(authorSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [authorSearch]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedDoctorSearch(doctorSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [doctorSearch]);

  const { data: authorsData, isLoading: authorsLoading } = useAuthorsListQuery(
    debouncedAuthorSearch
  );
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctorsListQuery(
    debouncedDoctorSearch
  ) as any;

  useEffect(() => {
    if (initialValues) {
      setArticleData((prev) => ({
        ...prev,
        catID: initialValues.catID ?? prev.catID,
        itmTitle: initialValues.itmTitle ?? prev.itmTitle,
        itmMinimal: initialValues.itmMinimal ?? prev.itmMinimal,
        itmMetaDesc: initialValues.itmMetaDesc ?? prev.itmMetaDesc,
        itmSlug: initialValues.itmSlug ?? prev.itmSlug,
        narID: initialValues.narID ?? prev.narID,
        docID: initialValues.docID ?? prev.docID,
        readTime: initialValues.readTime ?? prev.readTime,
        coverImageUrl: initialValues.coverImageUrl ?? prev.coverImageUrl,
        thumbImageUrl: initialValues.thumbImageUrl ?? prev.thumbImageUrl,
      }));
    }
    if (initialArticleId) {
      setArticleId(initialArticleId);
      setTabStatus((prev) => ({ ...prev, basic: "saved" }));
    }
  }, [initialValues, initialArticleId]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      if (thumbPreviewUrl) URL.revokeObjectURL(thumbPreviewUrl);
    };
  }, [coverPreviewUrl, thumbPreviewUrl]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSaveBasic = async () => {
    if (!articleData.catID) {
      showError("دسته‌بندی را انتخاب کنید");
      return;
    }
    if (!articleData.itmTitle) {
      showError("عنوان مقاله را وارد کنید");
      return;
    }
    if (!articleData.itmSlug) {
      showError("اسلاگ (URL) را وارد کنید");
      return;
    }

    setIsSaving("basic");
    try {
      const basicData = {
        catID: articleData.catID,
        itmTitle: articleData.itmTitle,
        itmSlug: articleData.itmSlug,
      };

      const id = await onSaveBasic(basicData);
      setArticleId(id);
      setTabStatus((prev) => ({ ...prev, basic: "saved" }));
      showSuccess("اطلاعات اولیه با موفقیت ذخیره شد");
      setActiveTab("details");
    } catch {
      setTabStatus((prev) => ({ ...prev, basic: "error" }));
      showError("خطا در ذخیره اطلاعات اولیه");
    } finally {
      setIsSaving("");
    }
  };

  const handleSaveDetails = async () => {
    setIsSaving("details");
    try {
      const detailsData = {
        catID: articleData.catID,
        itmTitle: articleData.itmTitle,
        itmID: articleId,
        narID: articleData.narID,
        docID: articleData.docID,
        readTime: toPlainText(articleData.readTime),
        itmMetaDesc: toPlainText(articleData.itmMetaDesc),
        itmSlug: articleData.itmSlug,
        itmMinimal: articleData.itmMinimal,
        coverImage: articleData.coverImage,
        thumbImage: articleData.thumbImage,
      };

      await onSaveDetails(detailsData, articleId || "0");
      setTabStatus((prev) => ({ ...prev, details: "saved" }));
      showSuccess("جزئیات مقاله با موفقیت ذخیره شد");
      setActiveTab("files");
    } catch {
      setTabStatus((prev) => ({ ...prev, details: "error" }));
      showError("خطا در ذخیره جزئیات مقاله");
    } finally {
      setIsSaving("");
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const toPlainText = (value?: string | null): string => {
    if (!value) return "";
    const noTags = value.replace(/<[^>]*>/g, "");
    return noTags.replace(/\s+/g, " ").trim();
  };

  const getTabIcon = (tabName: keyof TabStatus) => {
    const status = tabStatus[tabName];
    switch (status) {
      case "saved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const isTabDisabled = (tabName: keyof TabStatus) => {
    if (tabName === "basic") {
      return Boolean(articleId);
    }
    return false;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {articleId && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {articleData.itmTitle && (
              <p className="text-lg text-gray-600 font-medium">
                {articleData.itmTitle}
              </p>
            )}
            {articleData.itmSlug && (
              <div className="text-sm text-gray-500">
                اسلاگ: {articleData.itmSlug}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            بازگشت
          </Button>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
        dir="rtl"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="basic"
            className="flex items-center gap-2"
            disabled={isTabDisabled("basic")}
          >
            <FileText className="h-4 w-4" />
            اطلاعات اولیه
            {getTabIcon("basic")}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex items-center gap-2"
            disabled={isTabDisabled("details")}
          >
            <ImageIcon className="h-4 w-4" />
            جزئیات مقاله
            {getTabIcon("details")}
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="flex items-center gap-2"
            disabled={isTabDisabled("files")}
          >
            <FileUp className="h-4 w-4" />
            فایل‌های مقاله
            {getTabIcon("files")}
          </TabsTrigger>
          <TabsTrigger
            value="final"
            className="flex items-center gap-2"
            disabled={isTabDisabled("final")}
          >
            <Settings className="h-4 w-4" />
            تنظیمات نهایی
            {getTabIcon("final")}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                اطلاعات اولیه مقاله
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catID">دسته‌بندی مقاله *</Label>
                  <Select
                    value={articleData.catID}
                    onValueChange={(value: string) =>
                      setArticleData({ ...articleData, catID: value })
                    }
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data?.entries?.map((category: any) => (
                        <SelectItem
                          key={category.cat_ID}
                          value={category.cat_ID.toString()}
                        >
                          {category.cat_Title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itmTitle">عنوان مقاله *</Label>
                  <Input
                    id="itmTitle"
                    value={articleData.itmTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArticleData({
                        ...articleData,
                        itmTitle: e.target.value,
                      })
                    }
                    placeholder="عنوان مقاله را وارد کنید..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itmSlug">اسلاگ (URL) *</Label>
                  <Input
                    id="itmSlug"
                    value={articleData.itmSlug}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArticleData({
                        ...articleData,
                        itmSlug: e.target.value,
                      })
                    }
                    placeholder="مثال: how-to-start..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveBasic}
                  disabled={isSaving === "basic" || categoriesLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving === "basic"
                    ? "در حال ذخیره..."
                    : "ذخیره اطلاعات اولیه"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Details */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                جزئیات مقاله
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catID2">دسته‌بندی مقاله *</Label>
                  <Select
                    value={articleData.catID}
                    onValueChange={(value: string) =>
                      setArticleData({ ...articleData, catID: value })
                    }
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data?.entries?.map((category: any) => (
                        <SelectItem
                          key={category.cat_ID}
                          value={category.cat_ID.toString()}
                        >
                          {category.cat_Title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itmTitle2">عنوان مقاله *</Label>
                  <Input
                    id="itmTitle2"
                    value={articleData.itmTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArticleData({
                        ...articleData,
                        itmTitle: e.target.value,
                      })
                    }
                    placeholder="عنوان مقاله..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itmSlug2">اسلاگ (URL) *</Label>
                  <Input
                    id="itmSlug2"
                    value={articleData.itmSlug}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArticleData({
                        ...articleData,
                        itmSlug: e.target.value,
                      })
                    }
                    placeholder="مثال: how-to-start..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="narID">نویسنده</Label>
                  <SearchableSelect
                    options={(authorsData?.data?.entries ?? []).map((item: any) => {
                      const id = String(item.doc_ID ?? item.docId ?? item.nar_ID ?? item.id ?? "");
                      const name = `${item?.doc_Name ?? item?.docName ?? ""} ${item?.doc_Family ?? item?.docFamily ?? ""}`.trim();
                      const label = name || item?.doc_Title || item?.nar_Title || item?.title || item?.name || id;
                      return { value: id, label };
                    })}
                    value={articleData.narID}
                    onValueChange={(value) =>
                      setArticleData({ ...articleData, narID: value })
                    }
                    onSearchChange={setAuthorSearch}
                    placeholder="انتخاب نویسنده"
                    isLoading={authorsLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="readTime">زمان مطالعه</Label>
                  <Input
                    id="readTime"
                    value={articleData.readTime || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArticleData({ ...articleData, readTime: e.target.value })
                    }
                    placeholder="مثال: 7 دقیقه"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docID">پزشک تایید کننده</Label>
                  <SearchableSelect
                    options={(doctorsData?.entries ?? []).map((doctor: any) => {
                      const id = String(doctor.doc_ID);
                      const name = `${doctor.doc_Name} ${doctor.doc_Family}`.trim();
                      const specialty = doctor.spc_Title;
                      const label = name ? `${name} - ${specialty}` : id;
                      return { value: id, label };
                    })}
                    value={articleData.docID}
                    onValueChange={(value) =>
                      setArticleData({ ...articleData, docID: value })
                    }
                    onSearchChange={setDoctorSearch}
                    placeholder="انتخاب پزشک تایید کننده"
                    isLoading={doctorsLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itmMinimal">خلاصه کوتاه *</Label>
                <SimpleRichEditor
                  value={articleData.itmMinimal}
                  onChange={(value: string) =>
                    setArticleData({ ...articleData, itmMinimal: value })
                  }
                  placeholder="خلاصه کوتاه مقاله..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itmMetaDesc">متا دسکریپشن</Label>
                  <Textarea
                    id="itmMetaDesc"
                    value={articleData.itmMetaDesc}
                    onChange={(e) =>
                      setArticleData({ ...articleData, itmMetaDesc: e.target.value })
                    }
                    placeholder="توضیح کوتاه برای SEO..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">تصویر کاور</Label>
                  {(coverPreviewUrl || articleData.coverImageUrl) && (
                    <img
                      src={coverPreviewUrl || articleData.coverImageUrl!}
                      alt="کاور"
                      className="w-40 h-24 object-cover rounded border mb-2"
                    />
                  )}
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setArticleData({ ...articleData, coverImage: file });
                        const reader = new FileReader();
                        reader.onload = () => {
                          setCoverPreviewUrl(String(reader.result || ""));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setArticleData({ ...articleData, coverImage: null });
                        setCoverPreviewUrl("");
                      }
                    }}
                  />

                  <Label htmlFor="thumbImage" className="mt-4">تصویر تامبنیل</Label>
                  {(thumbPreviewUrl || articleData.thumbImageUrl) && (
                    <img
                      src={thumbPreviewUrl || articleData.thumbImageUrl!}
                      alt="تامبنیل"
                      className="w-32 h-20 object-cover rounded border mb-2"
                    />
                  )}
                  <Input
                    id="thumbImage"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setArticleData({ ...articleData, thumbImage: file });
                        const reader = new FileReader();
                        reader.onload = () => {
                          setThumbPreviewUrl(String(reader.result || ""));
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setArticleData({ ...articleData, thumbImage: null });
                        setThumbPreviewUrl("");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveDetails}
                  disabled={isSaving === "details"}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving === "details"
                    ? "در حال ذخیره..."
                    : "ذخیره جزئیات مقاله"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Files */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" />
                فایل‌های مقاله
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadBox
                resourceId={articleId}
                onAllUploaded={() => {
                  showSuccess("فایل‌ها با موفقیت آپلود شدند");
                  setTabStatus((prev) => ({ ...prev, files: "saved" }));
                }}
                disabled={!articleId}
              />
              
              {!articleId && (
                <div className="text-center text-muted-foreground py-4">
                  <p>ابتدا اطلاعات اولیه را ذخیره کنید</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Final Settings */}
        <TabsContent value="final" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                تنظیمات نهایی مقاله
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">مقاله شما آماده انتشار است!</p>
                <p className="text-sm mt-2">می‌توانید به لیست مقالات بازگردید</p>
                <Button 
                  onClick={() => router.push('/article')}
                  className="mt-4"
                >
                  بازگشت به لیست مقالات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

