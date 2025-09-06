import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Activity, Settings, AlertCircle } from "lucide-react";

export default async function GuardianDashboard() {
  const supabase = await createServerClient();
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Check if user is a guardian
  const { data: guardian, error: guardianError } = await supabase
    .from("guardian")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (guardianError || !guardian) {
    redirect("/onboarding");
  }

  // Get linked students with profile data
  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select(`
      id,
      user_id,
      grade_level,
      school_id,
      relationship_with_guardian
    `)
    .eq("guardian_id", guardian.id);

  // Get profile data for each student
  const studentsWithProfiles = await Promise.all(
    (students || []).map(async (student) => {
      const { data: profile } = await supabase
        .from("profile")
        .select("name, email, active")
        .eq("id", student.user_id)
        .single();
      return { ...student, profile };
    })
  );

  const linkedStudents = studentsWithProfiles || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Guardian Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your students' educational journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Linked Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkedStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              {linkedStudents.length === 0 ? "No students linked yet" : "Active students"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Current activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Verified guardian</p>
          </CardContent>
        </Card>
      </div>

      {/* Linked Students Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Linked Students</CardTitle>
          <CardDescription>
            Students under your supervision
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkedStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Linked</h3>
              <p className="text-muted-foreground mb-4">
                You haven't linked any students to your guardian account yet.
              </p>
              <Button>Add Student</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{student.profile?.name || "Unknown Student"}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {student.grade_level} • {student.relationship_with_guardian}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.profile?.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {student.profile?.active ? "Active" : "Inactive"}
                    </span>
                    <Button variant="outline" size="sm">
                      View Activity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common guardian tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add Another Student
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="mr-2 h-4 w-4" />
              View Activity Reports
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertCircle className="mr-2 h-4 w-4" />
              Set Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}