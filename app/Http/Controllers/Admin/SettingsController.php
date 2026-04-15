<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $prodamus = [
            'prodamus_url' => Setting::getValue('prodamus_url', ''),
            'prodamus_secret_key' => Setting::getValue('prodamus_secret_key', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'prodamus' => $prodamus,
        ]);
    }

    public function updateProdamus(Request $request)
    {
        $request->validate([
            'prodamus_url' => 'nullable|url',
            'prodamus_secret_key' => 'nullable|string',
        ]);

        Setting::setValue('prodamus_url', $request->input('prodamus_url'));
        Setting::setValue('prodamus_secret_key', $request->input('prodamus_secret_key'));

        return back()->with('message', 'Настройки Prodamus сохранены');
    }
}
