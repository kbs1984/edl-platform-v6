import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchoolAction, searchSchoolAction } from "@/lib/actions/school-actions";
import { StudentData } from "@/types/form";

export const SchoolSearch = ({ formData, setFormData, disabled }: { formData: StudentData, setFormData: React.Dispatch<React.SetStateAction<StudentData>>, disabled: boolean }) => {
  const [isSchoolSearchOpen, setIsSchoolSearchOpen] = useState(true);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [schoolSearchResults, setSchoolSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [isSchoolSelected, setIsSchoolSelected] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSchoolSearchQuery(e.target.value)
    setIsSchoolSelected(false);
    setFormData((prev) => ({
      ...prev,
      schoolName: e.target.value,
    }))
  }

  const selectSchool = (school: { id: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      schoolId: school.id,
      schoolName: school.name,
    }))
    setSchoolSearchQuery("");
    setSchoolSearchResults([]);
    setIsSchoolSelected(true);
  }

  const registerNewSchool = () => {
    registerSchoolAction(newSchoolName)
      .then((res) => {
        if (res) setFormData((prev) => ({
          ...prev,
          schoolId: res.id,
          schoolName: newSchoolName,
        }))
      });
    setNewSchoolName("");
    setSchoolSearchResults([]);
    setIsSchoolSearchOpen(false);
    setIsSchoolSelected(true);
  }

  useEffect(() => {
    if (schoolSearchQuery === "") {
      setSchoolSearchResults([]);
      return;
    }
    setIsSearching(true)
    searchSchoolAction(schoolSearchQuery).then((res) => {setSchoolSearchResults(res as {id: string, name: string}[])})
    setIsSearching(false)
  }, [schoolSearchQuery]);
  
  return (
    <div 
      className="space-y-4 relative"
      onFocus={() => setIsSchoolSearchOpen(true)}
      onBlur={() => setIsSchoolSearchOpen(false)}
    >
      <div className="relative">
        <Input
          id="schoolSearch"
          value={disabled ? "": formData.schoolName}
          onChange={handleChange}
          placeholder="Search for your school"
          name="school"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          disabled={disabled}
          className="mt-4"
        />
      </div>

      <div className="absolute top-full w-full z-50 bg-popover rounded-md" >
        {isSearching ? (
          <p className="text-center p-2 py-10 text-sm">Searching...</p>
        ) : isSchoolSearchOpen && schoolSearchResults.length > 0 ? (
          <div className="rounded-md overflow-scroll max-h-80">
            <ul className="flex flex-col gap-1 p-1 py-2">
              {schoolSearchResults.map((school) => (
                <li
                  key={school.id}
                  onMouseDown={(e) => e.preventDefault()} 
                  className="p-2 pl-8 hover:bg-[#333] text-sm cursor-pointer transition-all rounded flex justify-start items-center"
                  onClick={() => selectSchool(school)}
                >
                  {school.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (isSchoolSearchOpen && !isSchoolSelected && schoolSearchQuery && schoolSearchResults.length === 0 && !isSearching) && (
          <div className="text-center p-2 py-10">
            <p className="text-[#bfbfbf] mb-2">No schools found</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onMouseDown={(e) => e.preventDefault()}>
                  <Plus className="h-4 w-4 mr-2" /> Register New School
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background text-foreground border-background/80">
                <DialogHeader>
                  <DialogTitle>Register New School</DialogTitle>
                  <DialogDescription className="text-[#bfbfbf]">
                    Enter the name of your school to register it in our system.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    id="newSchoolName"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="School name"
                    className="bg-[#111113] border-[#333] text-white mt-4"
                    name="newSchoolName"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant={"primary"}
                      onClick={registerNewSchool}
                      disabled={!newSchoolName.trim()}
                    >
                      Register
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}