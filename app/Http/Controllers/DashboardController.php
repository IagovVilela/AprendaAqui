<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::where('user_id', Auth::id())
            ->with(['course.instructor'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        $totalCourses = Enrollment::where('user_id', Auth::id())->count();
        $completedCourses = Enrollment::where('user_id', Auth::id())
            ->where('status', 'completed')
            ->count();

        return view('dashboard.index', compact('enrollments', 'totalCourses', 'completedCourses'));
    }
}
