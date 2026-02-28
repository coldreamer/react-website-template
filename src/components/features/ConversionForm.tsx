"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

// 常见国家码列表
const COUNTRY_CODES = [
  { code: "+86", name: "中国", flag: "🇨🇳" },
  { code: "+1", name: "美国/加拿大", flag: "🇺🇸" },
  { code: "+852", name: "香港", flag: "🇭🇰" },
  { code: "+853", name: "澳门", flag: "🇲🇴" },
  { code: "+886", name: "台湾", flag: "🇹🇼" },
  { code: "+65", name: "新加坡", flag: "🇸🇬" },
  { code: "+81", name: "日本", flag: "🇯🇵" },
  { code: "+82", name: "韩国", flag: "🇰🇷" },
  { code: "+44", name: "英国", flag: "🇬🇧" },
  { code: "+61", name: "澳大利亚", flag: "🇦🇺" },
]

// Zod 验证规则
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "姓名至少需要 2 个字符" })
    .max(50, { message: "姓名不能超过 50 个字符" }),
  email: z
    .string()
    .email({ message: "请输入有效的邮箱地址" })
    .min(1, { message: "邮箱不能为空" }),
  countryCode: z.string().min(1, { message: "请选择国家码" }),
  phone: z
    .string()
    .min(1, { message: "手机号不能为空" })
    .regex(/^[0-9]{6,15}$/, {
      message: "手机号必须是 6-15 位数字",
    }),
})

type FormValues = z.infer<typeof formSchema>

export function ConversionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+86",
      phone: "",
    },
  })

  // 模拟提交表单
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // 模拟 API 请求
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟 80% 成功率
          if (Math.random() > 0.2) {
            resolve(data)
          } else {
            reject(new Error("提交失败，请稍后重试"))
          }
        }, 2000)
      })

      // 成功
      setIsSuccess(true)
      form.reset()

      // 3秒后重置成功状态
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      // 失败时显示 Toast
      toast({
        variant: "destructive",
        title: "提交失败",
        description: error instanceof Error ? error.message : "未知错误，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 成功状态 UI
  if (isSuccess) {
    return (
      <div className="w-full max-w-[450px] mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              提交成功！
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
              感谢您的提交，我们已收到您的信息，稍后会与您联系。
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="min-w-[120px]"
              >
                返回表单
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 表单 UI
  return (
    <div className="w-full max-w-[450px] mx-auto px-4 sm:px-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            联系我们
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            填写以下信息，我们会尽快与您联系
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* 姓名 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入您的姓名"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 邮箱 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 手机号（国家码 + 号码） */}
            <div className="space-y-2">
              <FormLabel>手机号</FormLabel>
              <div className="flex gap-2">
                {/* 国家码选择 */}
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem className="w-[140px] flex-shrink-0">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRY_CODES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 手机号输入 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="请输入手机号"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-medium"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>提交中...</span>
                </span>
              ) : (
                "立即提交"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
