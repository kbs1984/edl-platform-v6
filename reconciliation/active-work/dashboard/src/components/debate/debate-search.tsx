'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchIcon  } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Team } from '@/types';
import { Selecter } from '../ui/select';
import { Separator } from '../ui/separator';

interface DebateSearchProps {
  team: Team;
  currentUserStatus: 'leader' | 'member' | 'invited' | 'non-member' | 'not-authenticated';
  debateFormats: { value: string; name: string }[];
}

export function DebateSearch({ team, currentUserStatus, debateFormats }: DebateSearchProps) {
  const [format, setFormat] = useState<string>("");
  const [challengeMode, setChallengeMode] = useState(false);
  const [motionSearch, setMotionSearch] = useState('');
  const [genreSearch, setGenreSearch] = useState('');

  const [genreSelected, setGenreSelected] = useState<string>("");
  const [motionSelected, setMotionSelected] = useState<string>("");
  
  const isActiveTeamMember = currentUserStatus === 'leader' || currentUserStatus === 'member';
  
  const handleSearchDebate = () => {
    // This would connect to your backend search API
    console.log({
      format,
      challengeMode,
      searchTerm: motionSearch,
      teamId: team.id
    });
    // TODO: Implement actual search functionality
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          Find a Debate
        </CardTitle>
        <CardDescription>
          Search for debates that match your team's criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className='space-y-4'>
          <Input 
            id="genreSearch"
            name="genreSearch"
            placeholder="Search genre"
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
            disabled={!isActiveTeamMember}
          />
          <Input
            id="search"
            name="search"
            placeholder="Search topic"
            disabled={!genreSelected}
            value={motionSearch}
            onChange={(e) => setMotionSearch(e.target.value)}
          /> 

          <Separator />

          <Selecter 
            value={format}
            onValueChange={setFormat}
            items={debateFormats}
            name="format"
            placeholder="Select debate format"
            classname="w-full"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <Label htmlFor="challenge-mode">Challenge Mode</Label>
            <p className="text-sm text-muted-foreground">
              Match with teams from upper divisions
            </p>
          </div>
          <Switch
            id="challenge-mode"
            checked={challengeMode}
            onCheckedChange={setChallengeMode}
          />
        </div>
        <Button 
          onClick={handleSearchDebate}
          className="w-full"
          disabled={!format || !genreSelected || !motionSearch}
        >
          Search for Debates
        </Button>
      </CardFooter>
    </Card>
  );
}
