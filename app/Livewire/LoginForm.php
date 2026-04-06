<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class LoginForm extends Component
{
    public $email = '';
    public $password = '';
    public $remember = false;
    public $isLoading = false;

    protected $rules = [
        'email' => 'required|email',
        'password' => 'required|min:6',
    ];

    protected $messages = [
        'email.required' => 'O email é obrigatório.',
        'email.email' => 'Digite um email válido.',
        'password.required' => 'A senha é obrigatória.',
        'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
    ];

    public function updated($propertyName)
    {
        $this->validateOnly($propertyName);
    }

    public function login()
    {
        $this->isLoading = true;
        
        try {
            // Verificar se o banco de dados está configurado
            if (!$this->isDatabaseConfigured()) {
                session()->flash('error', 'Banco de dados não configurado. Configure o banco de dados primeiro.');
                $this->isLoading = false;
                return;
            }

            $this->validate();

            if (!Auth::attempt(['email' => $this->email, 'password' => $this->password], $this->remember)) {
                $this->isLoading = false;
                throw ValidationException::withMessages([
                    'email' => 'As credenciais fornecidas não coincidem com nossos registros.',
                ]);
            }

            session()->regenerate();
            
            session()->flash('success', 'Login realizado com sucesso! Bem-vindo de volta!');
            
            return redirect()->route('dashboard');
        } catch (ValidationException $e) {
            $this->isLoading = false;
            throw $e;
        } catch (\Exception $e) {
            session()->flash('error', 'Erro ao fazer login: ' . $e->getMessage());
            $this->isLoading = false;
        }
    }

    private function isDatabaseConfigured()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function render()
    {
        return view('livewire.login-form');
    }
}
