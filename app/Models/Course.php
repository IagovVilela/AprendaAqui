<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'image',
        'category',
        'level',
        'price',
        'is_free',
        'is_published',
        'duration_hours',
        'total_lessons',
        'enrollments_count',
        'rating',
        'reviews_count',
        'instructor_id',
        'tags',
        'what_you_will_learn',
        'requirements',
        'order',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_published' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'tags' => 'array',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // Relacionamentos
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('status', 'progress_percentage', 'completed_at')
            ->withTimestamps();
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    // Helpers
    public function getFormattedPriceAttribute(): string
    {
        return $this->is_free ? 'Gratuito' : 'R$ ' . number_format($this->price, 2, ',', '.');
    }

    public function getTotalDurationAttribute(): int
    {
        return $this->modules()
            ->with('lessons')
            ->get()
            ->sum(fn($module) => $module->lessons->sum('video_duration_seconds'));
    }

    public function getTotalLessonsAttribute(): int
    {
        return $this->modules()
            ->withCount('lessons')
            ->get()
            ->sum('lessons_count');
    }

    public function getEnrollmentsCountAttribute(): int
    {
        return $this->enrollments()->count();
    }
}
