"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { PlusIcon, SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";

export default function Home() {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState<{
		title: string;
		description: string;
		countdown: string;
	} | null>(null);

	const handleCardClick = (index: number) => {
		setSelectedCard({
			title: `Task ${index + 1}`,
			description:
				"This is a placeholder description for the selected task. It provides additional context about what needs to be done.",
			countdown: "43D 12H 34M",
		});
		setIsSheetOpen(true);
	};

	return (
		<main className="flex flex-col min-h-screen p-4 pb-28">
			<div className="py-5 flex justify-between text-muted-foreground items-center">
				<p className="text-xl font-bold">Ciao, Mike</p>
				<Button size="icon" variant="ghost" className="size-8">
					<SettingsIcon className="size-6" />
				</Button>
			</div>

			<div className="space-y-2 text-center py-10">
				<p className="text-sm text-muted-foreground">Next reminder in</p>
				<p className="text-xl font-bold">43D 12H 34M</p>
			</div>

			<ul className="space-y-4">
				{Array.from({ length: 10 }).map((_, index) => (
					<li key={index}>
						<Card
							className=" border shadow-none py-2 gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
							onClick={() => handleCardClick(index)}
						>
							<CardHeader className="px-3">
								<CardTitle className="text-lg font-medium">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
								</CardTitle>
							</CardHeader>
							<CardContent className="px-3">
								<div className="flex justify-end items-center">
									<p className="font-medium text-sm text-muted-foreground">
										43D 12H 34M
									</p>
								</div>
							</CardContent>
						</Card>
					</li>
				))}
			</ul>

			<Button size="icon" className="fixed bottom-10 right-4 size-12 ">
				<PlusIcon className="size-8" />
			</Button>

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="w-7/8">
					<SheetHeader>
						<SheetTitle className="text-muted-foreground">
							Edit Reminder
						</SheetTitle>
					</SheetHeader>
					<div className="space-y-4 px-4">
						<Textarea
							defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit."
							className=" text-lg font-medium"
						/>
						<Textarea
							defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ex neque. Porro officia, ea totam deserunt, at quae sunt beatae labore, exercitationem maxime vel laborum fugit architecto rem in consequuntur."
							className=" text-sm text-muted-foreground"
						/>
						<DatePicker />
					</div>
					<Button className="flex mx-4 mt-auto mb-10 ">Save</Button>
				</SheetContent>
			</Sheet>
		</main>
	);
}
