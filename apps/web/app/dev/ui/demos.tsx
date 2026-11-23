"use client";

// Interactive demos for /dev/ui. Filler content only, not product copy.

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const chartData = [
  { category: "SEO", score: 82, fill: "var(--color-seo)" },
  { category: "Perf.", score: 64, fill: "var(--color-performance)" },
  { category: "A11y", score: 91, fill: "var(--color-accessibility)" },
  { category: "Tech.", score: 77, fill: "var(--color-technical)" },
  { category: "UX", score: 58, fill: "var(--color-ux)" },
];

const modeItems = [
  { value: "whole", label: "Whole site" },
  { value: "single", label: "Single page" },
];

const chartConfig = {
  score: { label: "Score" },
  seo: { label: "SEO", color: "var(--category-seo)" },
  performance: { label: "Performance", color: "var(--category-performance)" },
  accessibility: { label: "Accessibility", color: "var(--category-accessibility)" },
  technical: { label: "Technical & Security", color: "var(--category-technical)" },
  ux: { label: "UX & Conversion", color: "var(--category-ux)" },
} satisfies ChartConfig;

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 border bg-card p-4">
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

export function ComponentDemos() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-semibold">Components (UI-rules §15)</h2>
      <Toaster />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Demo title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button>Start audit</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete website</Button>
            <Button variant="link">Link</Button>
            <Button disabled>
              <Spinner /> Starting…
            </Button>
          </div>
        </Demo>

        <Demo title="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Websites</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">example.com</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Audit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>

        <Demo title="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-sm">Overview content.</TabsContent>
            <TabsContent value="issues" className="text-sm">Issues content.</TabsContent>
            <TabsContent value="pages" className="text-sm">Pages content.</TabsContent>
          </Tabs>
        </Demo>

        <Demo title="Dialog, alert dialog, sheet">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>A short description of the dialog.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>Delete</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this website?</AlertDialogTitle>
                  <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Delete website</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet title</SheetTitle>
                  <SheetDescription>Sheets hold the sidebar below lg.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </Demo>

        <Demo title="Dropdown menu, popover, tooltip">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
              <PopoverContent className="text-sm">Popover content.</PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>Tooltip</TooltipTrigger>
              <TooltipContent>22 Nov 2026, 14:05</TooltipContent>
            </Tooltip>
          </div>
        </Demo>

        <Demo title="Select and toggle group">
          {/* Base UI's Select needs `items` so the trigger shows the label, not the value. */}
          <Select items={modeItems} defaultValue="whole">
            <SelectTrigger className="w-48" aria-label="Audit mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup defaultValue={["mobile"]}>
            <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
            <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
          </ToggleGroup>
        </Demo>

        <Demo title="Field, input, switch, checkbox">
          <Field>
            <FieldLabel htmlFor="demo-url">Website URL</FieldLabel>
            <Input id="demo-url" placeholder="example.com" aria-describedby="demo-url-help" />
            <FieldDescription id="demo-url-help">We add https:// if you leave it out.</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="demo-name">Name</FieldLabel>
            <Input id="demo-name" aria-invalid aria-describedby="demo-name-error" />
            <FieldError id="demo-name-error">Enter a name.</FieldError>
          </Field>
          <div className="flex items-center gap-2">
            <Switch id="demo-switch" />
            <Label htmlFor="demo-switch">Indexing intent</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-check" />
            <Label htmlFor="demo-check">Remember this choice</Label>
          </div>
        </Demo>

        <Demo title="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>example.com</TableCell>
                <TableCell className="text-right tabular-nums">87</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>shop.example.org</TableCell>
                <TableCell className="text-right tabular-nums">54</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Demo>

        <Demo title="Chart (category colors)">
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="score" />
            </BarChart>
          </ChartContainer>
        </Demo>

        <Demo title="Progress, skeleton, spinner">
          <Progress value={40} aria-label="Pages scanned" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Spinner />
        </Demo>

        <Demo title="Accordion">
          <Accordion>
            <AccordionItem value="a">
              <AccordionTrigger>How is the score calculated?</AccordionTrigger>
              <AccordionContent className="text-sm">From the checks we ran.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>What does Provisional mean?</AccordionTrigger>
              <AccordionContent className="text-sm">Coverage was below 60%.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>

        <Demo title="Alert, avatar, toast">
          <Alert>
            <AlertTitle>Partially completed</AlertTitle>
            <AlertDescription>Some pages couldn&apos;t be scanned.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>Try again in a minute.</AlertDescription>
          </Alert>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => toast("Link copied")}>
              Show toast
            </Button>
          </div>
        </Demo>

        <Demo title="Empty state">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No websites yet</EmptyTitle>
              <EmptyDescription>Add a website to run your first audit.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Demo>

        <Demo title="Sidebar (collapsible none)">
          <SidebarProvider className="min-h-0 border">
            <Sidebar collapsible="none" className="h-56">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>SiteLens</SidebarGroupLabel>
                  <SidebarMenu>
                    {["Overview", "Websites", "Audits", "Issues", "Settings"].map((item, i) => (
                      <SidebarMenuItem key={item}>
                        <SidebarMenuButton isActive={i === 0}>{item}</SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </Demo>
      </div>
    </section>
  );
}
