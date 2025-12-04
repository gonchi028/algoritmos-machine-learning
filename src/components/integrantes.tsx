import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Integrantes = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Integrantes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Integrantes</DialogTitle>
          <DialogDescription>
            Proyecto de Tecnologias Emergentes
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 space-y-2 text-center">
          <p>Quispe Chumacero Gonzalo</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
