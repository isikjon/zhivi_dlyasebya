<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::where('id', '!=', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at->format('d.m.Y H:i'),
                        'is_blocked' => (bool) $user->is_blocked, // Добавим поле позже в миграции
                    ];
                }),
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('message', 'Пользователь удален');
    }

    public function toggleBlock(User $user)
    {
        $user->is_blocked = !$user->is_blocked;
        $user->save();
        
        $status = $user->is_blocked ? 'заблокирован' : 'разблокирован';
        return redirect()->back()->with('message', "Пользователь {$status}");
    }
}
