'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

<<<<<<< Updated upstream
import { cn } from '@/lib/utils'
import { buttonVariants } from './button-variants'
=======
import { cn } from '@/lib/utils/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/Button'
>>>>>>> Stashed changes

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLEmbedElement>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

const PaginationLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean; size?: 'default' | 'icon'; }>(({ className, isActive, size = 'default', ...props }, ref) => (
  <a
    ref={ref}
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'default' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
))
PaginationLink.displayName = 'PaginationLink'

const PaginationItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
PaginationItem.displayName = 'PaginationItem'

interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
}

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationPreviousProps
>(({ className, ...props }, ref) => (
  <PaginationItem>
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="icon"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous</span>
    </PaginationLink>
  </PaginationItem>
))
PaginationPrevious.displayName = 'PaginationPrevious'

interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
}

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationNextProps
>(({ className, ...props }, ref) => (
  <PaginationItem>
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      size="icon"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next</span>
    </PaginationLink>
  </PaginationItem>
))
PaginationNext.displayName = 'PaginationNext'

export { Pagination, PaginationContent, PaginationEllipsis, PaginationLink, PaginationItem, PaginationNext, PaginationPrevious }
