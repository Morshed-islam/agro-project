"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"
import DeleteBlogButton from "./delete-blog-button"

interface BlogPost {
  id: string
  title: string
  slug: string
  author: string
  published: boolean
  published_at: string | null
  created_at: string
  views?: number // Added views field
}

export default function BlogTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">শিরোনাম</TableHead>
            <TableHead className="whitespace-nowrap">লেখক</TableHead>
            <TableHead className="whitespace-nowrap">স্ট্যাটাস</TableHead>
            <TableHead className="whitespace-nowrap">ভিউ</TableHead> {/* Added views column */}
            <TableHead className="whitespace-nowrap">প্রকাশের তারিখ</TableHead>
            <TableHead className="whitespace-nowrap text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
              <TableCell className="whitespace-nowrap">{post.author || "—"}</TableCell>
              <TableCell>
                {post.published ? (
                  <Badge variant="default" className="bg-green-600">
                    প্রকাশিত
                  </Badge>
                ) : (
                  <Badge variant="secondary">খসড়া</Badge>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{post.views || 0}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("bn-BD") : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteBlogButton postId={post.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
