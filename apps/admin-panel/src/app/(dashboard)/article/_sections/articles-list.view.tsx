"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Check, X, Eye } from "lucide-react";

import { CustomTable, CustomButton, Button, Badge } from "@workspace/custom-ui";
import { 
  useAdminLearningListQuery, 
  useAcceptLearningMutation,
  type IAdminLearningListItem 
} from "@workspace/framework";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ArticlesListViewProps {
  searchTerm: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ArticlesListView({ searchTerm }: ArticlesListViewProps) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const [isAccepted, setIsAccepted] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const { data, isLoading } = useAdminLearningListQuery({ 
    isAccepted, 
    pageNo: currentPage,
    rowCount: 10,
    itmTitle: searchTerm || undefined
  });
  
  const acceptLearningMutation = useAcceptLearningMutation();
  const router = useRouter();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/article/edit/${id}`);
    },
    [router]
  );

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/article/details/${id}`);
    },
    [router]
  );

  const handleAcceptLearning = useCallback(
    (itmID: string, isAccepted: number) => {
      acceptLearningMutation.mutate({ itmID, isAccepted });
    },
    [acceptLearningMutation]
  );

  const handleTabChange = useCallback((newIsAccepted: number) => {
    setIsAccepted(newIsAccepted);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const customColumns = [
    {
      key: "itm_Title",
      label: "عنوان مقاله",
      render: (value: any, row: IAdminLearningListItem) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: "itm_Cat",
      label: "دسته‌بندی",
      render: (value: any) => (
        <div className="text-sm text-muted-foreground">{value}</div>
      ),
    },
    {
      key: "DateOfCreation",
      label: "تاریخ ایجاد",
      render: (value: any) => (
        <div className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString("fa-IR") : "نامشخص"}
        </div>
      ),
    },
    {
      key: "itm_View",
      label: "تعداد بازدید",
      render: (value: any) => (
        <div className="text-sm text-center">
          {value ? Number(value).toLocaleString("fa-IR") : "0"}
        </div>
      ),
    },
    {
      key: "itm_Acc",
      label: "وضعیت",
      render: (value: any) => (
        <Badge variant={value === 1 ? "default" : "secondary"}>
          {value === 1 ? "منتشر شده" : "پیش‌نویس"}
        </Badge>
      ),
    },
    {
      key: "action",
      label: "عملیات",
      render: (_: any, row: IAdminLearningListItem) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.itm_ID)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.itm_ID)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant={row.itm_Acc === 1 ? "destructive" : "default"}
            size="sm"
            onClick={() =>
              handleAcceptLearning(row.itm_ID, row.itm_Acc === 1 ? 0 : 1)
            }
            disabled={acceptLearningMutation.isPending}
          >
            {row.itm_Acc === 1 ? (
              <X className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={isAccepted === 1 ? "default" : "outline"}
          onClick={() => handleTabChange(1)}
        >
          مقالات منتشر شده
          {isAccepted === 1 && (
            <Badge variant="secondary" className="mr-2">
              {data?.data?.metadata?.totalRows || 0}
            </Badge>
          )}
        </Button>
        <Button
          variant={isAccepted === 0 ? "default" : "outline"}
          onClick={() => handleTabChange(0)}
        >
          پیش‌نویس‌ها
          {isAccepted === 0 && (
            <Badge variant="secondary" className="mr-2">
              {data?.data?.metadata?.totalRows || 0}
            </Badge>
          )}
        </Button>
      </div>

      {/* Table */}
      <CustomTable
        data={data?.data?.entries ?? []}
        columns={customColumns}
        pageSize={10}
        totalPages={data?.data?.metadata?.pageCount}
        currentPage={currentPage}
        totalItems={data?.data?.metadata?.totalRows}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

