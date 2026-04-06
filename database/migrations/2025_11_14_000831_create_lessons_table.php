<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('content')->nullable(); // Conteúdo em texto/markdown
            $table->string('video_url')->nullable();
            $table->string('video_duration')->nullable(); // Formato: "00:15:30"
            $table->enum('type', ['video', 'text', 'quiz', 'assignment'])->default('video');
            $table->boolean('is_free')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('order')->default(0);
            $table->integer('views_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
