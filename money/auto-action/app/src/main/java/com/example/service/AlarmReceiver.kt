package com.example.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.example.data.repository.ActionRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val actionId = intent.getIntExtra("ACTION_ID", -1)
        if (actionId == -1) return

        Log.d("AlarmReceiver", "Triggered scheduled macro for Action ID: $actionId")

        CoroutineScope(Dispatchers.IO).launch {
            val repository = ActionRepository(context)
            if (repository.canExecuteAction()) {
                val actionWithSteps = repository.getActionWithSteps(actionId)
                if (actionWithSteps != null && actionWithSteps.steps.isNotEmpty()) {
                    AutoActionAccessibilityService.instance?.executeGestureSequence(
                        steps = actionWithSteps.steps,
                        onComplete = {
                            CoroutineScope(Dispatchers.IO).launch {
                                repository.recordActionRun(actionId)
                            }
                        }
                    )
                }
            }
        }
    }
}
